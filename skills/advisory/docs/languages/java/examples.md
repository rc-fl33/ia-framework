# Java Secure Coding Examples

**Purpose:** Real-world vulnerable and secure code patterns for Java code review
**Based on:** OWASP ASVS v5, CWE Top 25, SEI CERT Oracle Secure Coding Standard for Java

---

## XML External Entity (CWE-611)

### ❌ Vulnerable - Default XML Parser

```java
import javax.xml.parsers.*;
import org.w3c.dom.*;

public class XmlParser {
    public Document parseXml(InputStream input) throws Exception {
        // WRONG: external entities enabled by default
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(input);
    }
}

// Attack: XXE payload in XML
// <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
// Result: File disclosure
```

### ✅ Secure - Disabled External Entities

```java
import javax.xml.parsers.*;
import org.w3c.dom.*;

public class SecureXmlParser {
    public Document parseXml(InputStream input) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        // Disable external entities
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        factory.setXIncludeAware(false);
        factory.setExpandEntityReferences(false);

        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(input);
    }
}
```

### ✅ Secure - JAXB with Safe Parser

```java
import javax.xml.bind.*;
import javax.xml.parsers.*;
import org.xml.sax.*;

public class SecureJaxbParser {
    public User parseUser(String xml) throws Exception {
        JAXBContext context = JAXBContext.newInstance(User.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();

        // Create secure SAX parser
        SAXParserFactory spf = SAXParserFactory.newInstance();
        spf.setFeature("http://xml.org/sax/features/external-general-entities", false);
        spf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        spf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

        XMLReader reader = spf.newSAXParser().getXMLReader();
        SAXSource source = new SAXSource(reader, new InputSource(new StringReader(xml)));

        return (User) unmarshaller.unmarshal(source);
    }
}
```

---

## Insecure Deserialization (CWE-502)

### ❌ Vulnerable - Unsafe Deserialization

```java
import java.io.*;

public class DataLoader {
    public Object loadData(File file) throws Exception {
        // WRONG: deserializes any class
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
        return ois.readObject();
    }
}

// Attack: Malicious serialized object
// Result: Remote code execution
```

### ✅ Secure - Whitelist with ObjectInputFilter (Java 9+)

```java
import java.io.*;

public class SecureDataLoader {
    public Object loadData(File file) throws Exception {
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));

        // Whitelist allowed classes
        ois.setObjectInputFilter(info -> {
            if (info.serialClass() != null) {
                if (info.serialClass() == User.class ||
                    info.serialClass() == String.class ||
                    info.serialClass() == Integer.class) {
                    return ObjectInputFilter.Status.ALLOWED;
                }
                return ObjectInputFilter.Status.REJECTED;
            }
            return ObjectInputFilter.Status.UNDECIDED;
        });

        return ois.readObject();
    }
}
```

### ✅ Secure - Use JSON Instead

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonDataLoader {
    private final ObjectMapper mapper = new ObjectMapper();

    public User loadUser(String json) throws Exception {
        // Safe: only deserializes to specified class
        return mapper.readValue(json, User.class);
    }
}
```

---

## SQL Injection (CWE-89)

### ❌ Vulnerable - String Concatenation

```java
import java.sql.*;

public class UserDao {
    public User findById(Connection conn, String userId) throws SQLException {
        // WRONG: SQL injection vulnerability
        String query = "SELECT * FROM users WHERE id = " + userId;
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        if (rs.next()) {
            return mapUser(rs);
        }
        return null;
    }
}

// Attack: userId = "1 OR 1=1"
// Result: Returns all users
```

### ✅ Secure - PreparedStatement

```java
import java.sql.*;

public class SecureUserDao {
    public User findById(Connection conn, String userId) throws SQLException {
        String query = "SELECT * FROM users WHERE id = ?";
        PreparedStatement pstmt = conn.prepareStatement(query);
        pstmt.setString(1, userId);
        ResultSet rs = pstmt.executeQuery();

        if (rs.next()) {
            return mapUser(rs);
        }
        return null;
    }
}
```

### ✅ Secure - Spring JdbcTemplate

```java
import org.springframework.jdbc.core.JdbcTemplate;

public class SpringUserDao {
    private final JdbcTemplate jdbcTemplate;

    public User findById(String userId) {
        String query = "SELECT * FROM users WHERE id = ?";
        return jdbcTemplate.queryForObject(query, new UserRowMapper(), userId);
    }
}
```

### ✅ Secure - JPA/Hibernate

```java
import javax.persistence.*;

@Repository
public class JpaUserDao {
    @PersistenceContext
    private EntityManager entityManager;

    public User findById(String userId) {
        // JPA automatically parameterizes
        return entityManager.find(User.class, userId);
    }

    public List<User> findByUsername(String username) {
        // Named parameter
        TypedQuery<User> query = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        return query.getResultList();
    }
}
```

---

## LDAP Injection (CWE-90)

### ❌ Vulnerable - Unescaped LDAP Query

```java
import javax.naming.*;
import javax.naming.directory.*;

public class LdapAuth {
    public boolean authenticate(String username, String password) throws Exception {
        // WRONG: LDAP injection
        String filter = "(uid=" + username + ")";

        DirContext ctx = getLdapContext();
        NamingEnumeration<SearchResult> results =
            ctx.search("ou=users,dc=example,dc=com", filter, null);

        return results.hasMore();
    }
}

// Attack: username = "admin)(|(uid=*"
// Result: Authentication bypass
```

### ✅ Secure - Escaped LDAP Query

```java
public class SecureLdapAuth {
    public boolean authenticate(String username, String password) throws Exception {
        // Escape special LDAP characters
        String escapedUsername = escapeLdapSearchFilter(username);
        String filter = "(uid=" + escapedUsername + ")";

        DirContext ctx = getLdapContext();
        NamingEnumeration<SearchResult> results =
            ctx.search("ou=users,dc=example,dc=com", filter, null);

        return results.hasMore();
    }

    private String escapeLdapSearchFilter(String filter) {
        StringBuilder sb = new StringBuilder();
        for (char c : filter.toCharArray()) {
            switch (c) {
                case '\\': sb.append("\\5c"); break;
                case '*':  sb.append("\\2a"); break;
                case '(':  sb.append("\\28"); break;
                case ')':  sb.append("\\29"); break;
                case '\0': sb.append("\\00"); break;
                default:   sb.append(c);
            }
        }
        return sb.toString();
    }
}
```

### ✅ Secure - Spring LDAP

```java
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.LdapQueryBuilder;

public class SpringLdapAuth {
    private final LdapTemplate ldapTemplate;

    public boolean authenticate(String username, String password) {
        // Spring LDAP automatically escapes
        LdapQuery query = LdapQueryBuilder.query()
            .where("uid").is(username);

        List<User> users = ldapTemplate.search(query, new UserAttributesMapper());
        return !users.isEmpty();
    }
}
```

---

## Path Traversal (CWE-22)

### ❌ Vulnerable - Unsafe File Access

```java
import java.io.*;

@RestController
public class FileController {
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filename) {
        // WRONG: path traversal vulnerability
        File file = new File("/uploads/" + filename);
        return ResponseEntity.ok(new FileSystemResource(file));
    }
}

// Attack: filename = "../../../etc/passwd"
// Result: Can access any file
```

### ✅ Secure - Canonical Path Validation

```java
import java.io.*;
import org.springframework.http.*;

@RestController
public class SecureFileController {
    private static final String BASE_DIR = "/uploads";

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filename)
            throws IOException {
        File baseDir = new File(BASE_DIR).getCanonicalFile();
        File file = new File(baseDir, filename).getCanonicalFile();

        // Ensure file is within base directory
        if (!file.getPath().startsWith(baseDir.getPath())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (!file.exists() || !file.isFile()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new FileSystemResource(file));
    }
}
```

---

## Command Injection (CWE-78)

### ❌ Vulnerable - Runtime.exec with String

```java
public class CommandExecutor {
    public String listFiles(String directory) throws Exception {
        // WRONG: command injection
        String command = "ls " + directory;
        Process process = Runtime.getRuntime().exec(command);

        return readOutput(process.getInputStream());
    }
}

// Attack: directory = "; rm -rf /"
// Result: Executes arbitrary commands
```

### ✅ Secure - Runtime.exec with Array

```java
public class SecureCommandExecutor {
    public String listFiles(String directory) throws Exception {
        // Use array form
        String[] command = {"ls", directory};
        Process process = Runtime.getRuntime().exec(command);

        return readOutput(process.getInputStream());
    }
}
```

### ✅ Secure - ProcessBuilder

```java
public class ProcessBuilderExecutor {
    public String listFiles(String directory) throws Exception {
        // Best: use ProcessBuilder
        ProcessBuilder pb = new ProcessBuilder("ls", directory);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        return readOutput(process.getInputStream());
    }
}
```

### ✅ Secure - Use Java APIs

```java
import java.nio.file.*;
import java.util.stream.Stream;

public class JavaFileOperations {
    public List<String> listFiles(String directory) throws IOException {
        // Best: use Java file APIs, not shell commands
        Path path = Paths.get(directory);

        try (Stream<Path> stream = Files.list(path)) {
            return stream
                .map(Path::getFileName)
                .map(Path::toString)
                .collect(Collectors.toList());
        }
    }
}
```

---

## SSRF (CWE-918)

### ❌ Vulnerable - Unvalidated URL Fetch

```java
import java.net.*;

@RestController
public class ProxyController {
    @GetMapping("/fetch")
    public String fetchUrl(@RequestParam String url) throws Exception {
        // WRONG: SSRF vulnerability
        URL targetUrl = new URL(url);
        URLConnection conn = targetUrl.openConnection();

        return readResponse(conn.getInputStream());
    }
}

// Attack: url = "http://169.254.169.254/latest/meta-data/"
// Result: Access to AWS metadata
```

### ✅ Secure - URL Validation

```java
import java.net.*;
import java.util.*;

@RestController
public class SecureProxyController {
    private static final List<String> ALLOWED_HOSTS =
        Arrays.asList("api.example.com", "cdn.example.com");

    @GetMapping("/fetch")
    public String fetchUrl(@RequestParam String url) throws Exception {
        URL targetUrl = new URL(url);

        // Validate protocol
        if (!"https".equals(targetUrl.getProtocol()) &&
            !"http".equals(targetUrl.getProtocol())) {
            throw new SecurityException("Invalid protocol");
        }

        // Validate hostname
        if (!ALLOWED_HOSTS.contains(targetUrl.getHost())) {
            throw new SecurityException("Host not allowed");
        }

        URLConnection conn = targetUrl.openConnection();
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);

        return readResponse(conn.getInputStream());
    }
}
```

---

## Log Injection (CWE-117)

### ❌ Vulnerable - Unsanitized Log Input

```java
import org.slf4j.*;

@RestController
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username) {
        // WRONG: log injection
        logger.info("User logged in: " + username);
        return ResponseEntity.ok().build();
    }
}

// Attack: username = "admin\nINFO User admin logged in"
// Result: Log forging
```

### ✅ Secure - Parameterized Logging

```java
import org.slf4j.*;

@RestController
public class SecureLoginController {
    private static final Logger logger = LoggerFactory.getLogger(SecureLoginController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username) {
        // Correct: parameterized logging
        logger.info("User logged in: {}", username);
        return ResponseEntity.ok().build();
    }
}
```

### ✅ Secure - Sanitized Input

```java
@RestController
public class SanitizedLoginController {
    private static final Logger logger = LoggerFactory.getLogger(SanitizedLoginController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username) {
        // Remove newlines and carriage returns
        String sanitized = username.replaceAll("[\n\r]", "_");
        logger.info("User logged in: " + sanitized);
        return ResponseEntity.ok().build();
    }
}
```

---

## Hardcoded Credentials (CWE-798)

### ❌ Vulnerable - Hardcoded Secrets

```java
@Configuration
public class DatabaseConfig {
    // WRONG: hardcoded credentials
    private static final String DB_PASSWORD = "SuperSecret123!";
    private static final String API_KEY = "sk-1234567890abcdef";

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:mysql://localhost/mydb")
            .username("admin")
            .password(DB_PASSWORD) // Hardcoded!
            .build();
    }
}
```

### ✅ Secure - Environment Variables

```java
@Configuration
public class SecureDatabaseConfig {
    @Value("${DB_PASSWORD}")
    private String dbPassword;

    @Value("${API_KEY}")
    private String apiKey;

    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:mysql://localhost/mydb")
            .username("admin")
            .password(dbPassword) // From environment
            .build();
    }
}

// application.properties (not committed to git):
// DB_PASSWORD=${DB_PASSWORD}
// API_KEY=${API_KEY}
```

---

## Weak Cryptography (CWE-327)

### ❌ Vulnerable - MD5 for Passwords

```java
import java.security.*;

public class PasswordHasher {
    public String hashPassword(String password) throws Exception {
        // WRONG: MD5 is broken
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] hash = md.digest(password.getBytes());
        return bytesToHex(hash);
    }
}
```

### ❌ Vulnerable - ECB Mode

```java
import javax.crypto.*;

public class Encryptor {
    public byte[] encrypt(byte[] data, SecretKey key) throws Exception {
        // WRONG: ECB mode is insecure
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(data);
    }
}
```

### ✅ Secure - BCrypt for Passwords

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class SecurePasswordService {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String hashPassword(String password) {
        return encoder.encode(password);
    }

    public boolean verifyPassword(String password, String hash) {
        return encoder.matches(password, hash);
    }
}
```

### ✅ Secure - GCM Mode Encryption

```java
import javax.crypto.*;
import javax.crypto.spec.*;
import java.security.SecureRandom;

public class SecureEncryptor {
    public byte[] encrypt(byte[] data, SecretKey key) throws Exception {
        // Generate random IV
        byte[] iv = new byte[12];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);

        // Use GCM mode
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        byte[] ciphertext = cipher.doFinal(data);

        // Prepend IV to ciphertext
        byte[] result = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(ciphertext, 0, result, iv.length, ciphertext.length);

        return result;
    }
}
```

---

## Insecure Random (CWE-330)

### ❌ Vulnerable - java.util.Random

```java
import java.util.Random;

public class TokenGenerator {
    public String generateToken() {
        // WRONG: not cryptographically secure
        Random random = new Random();
        return String.valueOf(random.nextLong());
    }
}
```

### ✅ Secure - SecureRandom

```java
import java.security.SecureRandom;
import java.util.Base64;

public class SecureTokenGenerator {
    private final SecureRandom random = new SecureRandom();

    public String generateToken() {
        byte[] token = new byte[32];
        random.nextBytes(token);
        return Base64.getEncoder().encodeToString(token);
    }

    public String generateSessionId() {
        byte[] sessionId = new byte[16];
        random.nextBytes(sessionId);
        return bytesToHex(sessionId);
    }
}
```

---

## Missing Authorization (CWE-862)

### ❌ Vulnerable - No Authorization Check

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // WRONG: anyone can delete any user
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

### ✅ Secure - Spring Security @PreAuthorize

```java
@RestController
@RequestMapping("/api/users")
public class SecureUserController {
    @Autowired
    private UserRepository userRepository;

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication auth) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

### ✅ Secure - Manual Authorization Check

```java
@RestController
@RequestMapping("/api/users")
public class ManualAuthUserController {
    @Autowired
    private UserRepository userRepository;

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails currentUser) {
        // Manual authorization check
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException());

        if (!currentUser.getUsername().equals(user.getUsername()) &&
            !hasRole(currentUser, "ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

---

## CSRF (CWE-352)

### ❌ Vulnerable - CSRF Disabled

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // WRONG: disables CSRF protection
            .authorizeRequests()
                .anyRequest().authenticated();
    }
}
```

### ✅ Secure - CSRF Enabled (Default)

```java
@Configuration
@EnableWebSecurity
public class SecureSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // CSRF enabled by default in Spring Security
            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            .authorizeRequests()
                .anyRequest().authenticated();
    }
}

// Frontend must include CSRF token in requests
// <meta name="_csrf" content="${_csrf.token}"/>
// <meta name="_csrf_header" content="${_csrf.headerName}"/>
```

---

## Open Redirect (CWE-601)

### ❌ Vulnerable - Unvalidated Redirect

```java
@Controller
public class RedirectController {
    @GetMapping("/redirect")
    public String redirect(@RequestParam String url) {
        // WRONG: open redirect
        return "redirect:" + url;
    }
}

// Attack: /redirect?url=https://evil.com/phishing
```

### ✅ Secure - Domain Whitelist

```java
@Controller
public class SecureRedirectController {
    private static final List<String> ALLOWED_DOMAINS =
        Arrays.asList("example.com", "app.example.com");

    @GetMapping("/redirect")
    public String redirect(@RequestParam String url) throws MalformedURLException {
        URL redirectUrl = new URL(url);

        if (ALLOWED_DOMAINS.contains(redirectUrl.getHost())) {
            return "redirect:" + url;
        }

        throw new SecurityException("Invalid redirect URL");
    }
}
```

---

**Created:** 2026-01-18
**Total Examples:** 14 vulnerability classes
**Coverage:** OWASP Top 10, CWE Top 25, Spring Boot focus
**Standards:** SEI CERT Oracle Secure Coding Standard for Java
**Status:** Complete
