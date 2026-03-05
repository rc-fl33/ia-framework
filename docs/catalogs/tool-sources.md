# Security Tool Sources Reference

**Purpose:** Official source repositories and documentation for security tools **VERIFIED INSTALLED** in IA Framework VPS containers.

**Last Verified:** 2025-12-24 (SSH inventory of OVHcloud VPS)

---

## Container: kali-pentest (8.01GB)

### Network Scanning & Discovery

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **nmap** | [github.com/nmap/nmap](https://github.com/nmap/nmap) | [nmap.org](https://nmap.org) | /usr/bin/nmap |
| **naabu** | [github.com/projectdiscovery/naabu](https://github.com/projectdiscovery/naabu) | [README](https://github.com/projectdiscovery/naabu#readme) | /root/go/bin/naabu |

### Web Fuzzing & Content Discovery

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **ffuf** | [github.com/ffuf/ffuf](https://github.com/ffuf/ffuf) | [README](https://github.com/ffuf/ffuf#readme) | /root/go/bin/ffuf |
| **feroxbuster** | [github.com/epi052/feroxbuster](https://github.com/epi052/feroxbuster) | [feroxbuster.com](https://epi052.github.io/feroxbuster-docs/) | /usr/local/bin/feroxbuster |

### API Security

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **arjun** | [github.com/s0md3v/Arjun](https://github.com/s0md3v/Arjun) | [README](https://github.com/s0md3v/Arjun#readme) | pip: arjun |

### Subdomain & DNS Discovery

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **subfinder** | [github.com/projectdiscovery/subfinder](https://github.com/projectdiscovery/subfinder) | [README](https://github.com/projectdiscovery/subfinder#readme) | /root/go/bin/subfinder |

### Web Application Reconnaissance

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **httpx** | [github.com/projectdiscovery/httpx](https://github.com/projectdiscovery/httpx) | [README](https://github.com/projectdiscovery/httpx#readme) | /root/go/bin/httpx |
| **katana** | [github.com/projectdiscovery/katana](https://github.com/projectdiscovery/katana) | [README](https://github.com/projectdiscovery/katana#readme) | /root/go/bin/katana |
| **dirb** | [sourceforge.net/projects/dirb](https://sourceforge.net/projects/dirb/) | [Kali Docs](https://www.kali.org/tools/dirb/) | /usr/bin/dirb |

### Vulnerability Scanning

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **nuclei** | [github.com/projectdiscovery/nuclei](https://github.com/projectdiscovery/nuclei) | [nuclei.projectdiscovery.io](https://nuclei.projectdiscovery.io/) | /root/go/bin/nuclei |
| **nikto** | [github.com/sullo/nikto](https://github.com/sullo/nikto) | [cirt.net/Nikto2](https://cirt.net/Nikto2) | /usr/bin/nikto |
| **wapiti** | [github.com/wapiti-scanner/wapiti](https://github.com/wapiti-scanner/wapiti) | [wapiti-scanner.github.io](https://wapiti-scanner.github.io/) | /usr/bin/wapiti |
| **cvemap** | [github.com/projectdiscovery/cvemap](https://github.com/projectdiscovery/cvemap) | [README](https://github.com/projectdiscovery/cvemap#readme) | /root/go/bin/cvemap |

### SQL Injection

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **sqlmap** | [github.com/sqlmapproject/sqlmap](https://github.com/sqlmapproject/sqlmap) | [sqlmap.org](https://sqlmap.org/) | /usr/bin/sqlmap |

### CMS Security

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **wpscan** | [github.com/wpscanteam/wpscan](https://github.com/wpscanteam/wpscan) | [wpscan.com](https://wpscan.com/) | /usr/bin/wpscan |

### Credential Testing

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **hydra** | [github.com/vanhauser-thc/thc-hydra](https://github.com/vanhauser-thc/thc-hydra) | [README](https://github.com/vanhauser-thc/thc-hydra#readme) | /usr/bin/hydra |
| **crackmapexec** | [github.com/byt3bl33d3r/CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) | [Wiki](https://wiki.porchetta.industries/) | /usr/bin/crackmapexec |
| **Responder** | [github.com/lgandx/Responder](https://github.com/lgandx/Responder) | [README](https://github.com/lgandx/Responder#readme) | /usr/sbin/responder |

### Exploit Research

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **searchsploit** | [github.com/offensive-security/exploitdb](https://github.com/offensive-security/exploitdb) | [exploit-db.com](https://www.exploit-db.com/) | /usr/bin/searchsploit |

### Network Utilities

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **netcat** | [nc110.sourceforge.io](https://nc110.sourceforge.io/) | [Kali Docs](https://www.kali.org/tools/netcat/) | /usr/bin/netcat |

---

## Container: metasploit (2.9GB)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **msfconsole** | [github.com/rapid7/metasploit-framework](https://github.com/rapid7/metasploit-framework) | [metasploit.com](https://www.metasploit.com/) | /usr/bin/msfconsole |
| **msfvenom** | [github.com/rapid7/metasploit-framework](https://github.com/rapid7/metasploit-framework) | [Payload Docs](https://docs.metasploit.com/docs/using-metasploit/basics/how-to-use-msfvenom.html) | /usr/bin/msfvenom |

---

## Container: ad-security (1.03GB)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **certipy** | [github.com/ly4k/Certipy](https://github.com/ly4k/Certipy) | [README](https://github.com/ly4k/Certipy#readme) | /usr/local/bin/certipy |
| **ldapsearch** | [OpenLDAP](https://www.openldap.org/) | [Man Page](https://www.openldap.org/software/man.cgi?query=ldapsearch) | /usr/bin/ldapsearch |
| **impacket-secretsdump** | [github.com/fortra/impacket](https://github.com/fortra/impacket) | [Docs](https://github.com/fortra/impacket#readme) | /usr/local/bin/impacket-secretsdump |
| **impacket-GetNPUsers** | [github.com/fortra/impacket](https://github.com/fortra/impacket) | [Docs](https://github.com/fortra/impacket#readme) | /usr/local/bin/impacket-GetNPUsers |
| **impacket-GetUserSPNs** | [github.com/fortra/impacket](https://github.com/fortra/impacket) | [Docs](https://github.com/fortra/impacket#readme) | /usr/local/bin/impacket-GetUserSPNs |

**Impacket Version:** 0.14.0.dev0+20251204

---

## Container: cloud-security (4.07GB)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Prowler** | [github.com/prowler-cloud/prowler](https://github.com/prowler-cloud/prowler) | [prowler.pro](https://prowler.pro/) | /usr/local/bin/prowler |
| **ScoutSuite** | [github.com/nccgroup/ScoutSuite](https://github.com/nccgroup/ScoutSuite) | [Wiki](https://github.com/nccgroup/ScoutSuite/wiki) | /usr/local/bin/scout |
| **Trivy** | [github.com/aquasecurity/trivy](https://github.com/aquasecurity/trivy) | [aquasecurity.github.io/trivy](https://aquasecurity.github.io/trivy/) | /usr/local/bin/trivy |
| **aws-cli** | [github.com/aws/aws-cli](https://github.com/aws/aws-cli) | [AWS Docs](https://docs.aws.amazon.com/cli/) | /usr/local/bin/aws |
| **az-cli** | [github.com/Azure/azure-cli](https://github.com/Azure/azure-cli) | [Azure Docs](https://learn.microsoft.com/en-us/cli/azure/) | /usr/bin/az |
| **gcloud** | [cloud.google.com/sdk](https://cloud.google.com/sdk) | [Docs](https://cloud.google.com/sdk/docs) | /usr/local/bin/gcloud |

**Versions:** Prowler 5.14.2, ScoutSuite 5.14.0, Trivy 0.68.2

---

## Container: garak (verified 2026-02-23)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Garak** | [github.com/NVIDIA/garak](https://github.com/NVIDIA/garak) | [garak.ai](https://garak.ai/) | /usr/local/bin/garak |
| **OpenAI SDK** | [github.com/openai/openai-python](https://github.com/openai/openai-python) | [platform.openai.com/docs](https://platform.openai.com/docs) | pip: openai |
| **Anthropic SDK** | [github.com/anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) | [docs.anthropic.com](https://docs.anthropic.com) | pip: anthropic |

**Versions:** garak 0.14.0, openai 2.21.0, anthropic 0.83.0
**Note:** CPU-only torch pre-installed; isolated from textattack to avoid numpy 2.x conflict.

---

## Container: pyrit (verified 2026-02-23)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **PyRIT** | [github.com/Azure/PyRIT](https://github.com/Azure/PyRIT) | [azure.github.io/PyRIT](https://azure.github.io/PyRIT/) | pip: pyrit |
| **LangChain** | [github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain) | [python.langchain.com](https://python.langchain.com) | pip: langchain |
| **OpenAI SDK** | [github.com/openai/openai-python](https://github.com/openai/openai-python) | [platform.openai.com/docs](https://platform.openai.com/docs) | pip: openai |
| **Anthropic SDK** | [github.com/anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) | [docs.anthropic.com](https://docs.anthropic.com) | pip: anthropic |

**Versions:** pyrit 0.11.0, langchain 1.2.10, openai 2.21.0, anthropic 0.83.0
**Note:** Primary container for manual API testing and multi-turn orchestration.

---

## Container: textattack (verified 2026-02-23)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **TextAttack** | [github.com/QData/TextAttack](https://github.com/QData/TextAttack) | [textattack.readthedocs.io](https://textattack.readthedocs.io) | pip: textattack |

**Version:** TextAttack 0.3.10
**Note:** numpy<2.0 pinned — flair dependency requires numpy 1.x ABI. Must remain isolated from garak/torch containers.

---

## Container: art (verified 2026-02-23)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Adversarial Robustness Toolbox** | [github.com/Trusted-AI/adversarial-robustness-toolbox](https://github.com/Trusted-AI/adversarial-robustness-toolbox) | [adversarial-robustness-toolbox.readthedocs.io](https://adversarial-robustness-toolbox.readthedocs.io) | pip: adversarial-robustness-toolbox |

**Version:** ART 1.20.1
**Note:** Supports sklearn, TF, Keras, PyTorch estimators. No GPU required for evasion/inference attacks.

---

## Container: promptinject (verified 2026-02-23)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **PromptInject** | [github.com/agencyenterprise/promptinject](https://github.com/agencyenterprise/promptinject) | [README](https://github.com/agencyenterprise/promptinject#readme) | pip: promptinject |
| **Rebuff** | [github.com/protectai/rebuff](https://github.com/protectai/rebuff) | [rebuff.ai](https://rebuff.ai) | pip: rebuff |

**Versions:** PromptInject 0.1.1.1, Rebuff installed
**Note:** Lightweight — no torch, no numpy constraints.

---

## Container: promptfoo (verified 2026-02-23)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **PromptFoo** | [github.com/promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | [promptfoo.dev/docs](https://promptfoo.dev/docs) | /usr/local/bin/promptfoo |

**Version:** PromptFoo 0.120.25
**Note:** Node.js container. OWASP LLM Top 10 and MITRE ATLAS built-in test suites. CI/CD native.

---

## Container: web3-security (3.95GB)

### Foundry Toolkit (Ethereum Development)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **forge** | [github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry) | [book.getfoundry.sh](https://book.getfoundry.sh/) | /root/.foundry/bin/forge |
| **cast** | [github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry) | [book.getfoundry.sh/cast](https://book.getfoundry.sh/reference/cast/) | /root/.foundry/bin/cast |
| **anvil** | [github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry) | [book.getfoundry.sh/anvil](https://book.getfoundry.sh/reference/anvil/) | /root/.foundry/bin/anvil |
| **chisel** | [github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry) | [book.getfoundry.sh/chisel](https://book.getfoundry.sh/reference/chisel/) | /root/.foundry/bin/chisel |

### Smart Contract Analysis

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Slither** | [github.com/crytic/slither](https://github.com/crytic/slither) | [README](https://github.com/crytic/slither#readme) | pip: slither-analyzer |
| **Mythril** | [github.com/ConsenSys/mythril](https://github.com/ConsenSys/mythril) | [Docs](https://mythril-classic.readthedocs.io/) | pip: mythril |
| **Echidna** | [github.com/crytic/echidna](https://github.com/crytic/echidna) | [Docs](https://secure-contracts.com/program-analysis/echidna/) | pip: echidna |
| **Semgrep** | [github.com/semgrep/semgrep](https://github.com/semgrep/semgrep) | [semgrep.dev](https://semgrep.dev/) | pip: semgrep |
| **Caracal** | [github.com/crytic/caracal](https://github.com/crytic/caracal) | [README](https://github.com/crytic/caracal#readme) | /root/.cargo/bin/caracal |

### Solidity Compiler

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **solc-select** | [github.com/crytic/solc-select](https://github.com/crytic/solc-select) | [README](https://github.com/crytic/solc-select#readme) | pip: solc-select |
| **Brownie** | [github.com/eth-brownie/brownie](https://github.com/eth-brownie/brownie) | [Docs](https://eth-brownie.readthedocs.io/) | pip: eth-brownie |

### StarkNet/Cairo Analysis

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Amarna** | [github.com/crytic/amarna](https://github.com/crytic/amarna) | [README](https://github.com/crytic/amarna#readme) | pip: amarna |
| **Thoth** | [github.com/FuzzingLabs/thoth](https://github.com/FuzzingLabs/thoth) | [README](https://github.com/FuzzingLabs/thoth#readme) | pip: thoth |
| **Halmos** | [github.com/a16z/halmos](https://github.com/a16z/halmos) | [README](https://github.com/a16z/halmos#readme) | pip: halmos |

**Versions:** Foundry 1.5.1-stable, Slither 0.11.3

---

## Container: mobile-tools (2.05GB)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Frida** | [github.com/frida/frida](https://github.com/frida/frida) | [frida.re](https://frida.re/) | /usr/local/bin/frida |
| **Objection** | [github.com/sensepost/objection](https://github.com/sensepost/objection) | [README](https://github.com/sensepost/objection#readme) | /usr/local/bin/objection |
| **jadx** | [github.com/skylot/jadx](https://github.com/skylot/jadx) | [README](https://github.com/skylot/jadx#readme) | /usr/bin/jadx |
| **apktool** | [github.com/iBotPeaches/Apktool](https://github.com/iBotPeaches/Apktool) | [Docs](https://apktool.org/) | /usr/bin/apktool |
| **Androguard** | [github.com/androguard/androguard](https://github.com/androguard/androguard) | [Docs](https://androguard.readthedocs.io/) | /usr/local/bin/androguard |

**Versions:** Frida 17.5.1, Objection 1.11.0, Androguard 4.1.3

---

## Container: playwright (2.51GB)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **Playwright** | [github.com/microsoft/playwright](https://github.com/microsoft/playwright) | [playwright.dev](https://playwright.dev/) | pip: playwright 1.49.0 |

---

## Container: reaper (176MB / ghcr.io 237MB)

| Tool | Source | Documentation | Verified |
|------|--------|---------------|----------|
| **REAPER** | [github.com/ghostsecurity/reaper](https://github.com/ghostsecurity/reaper) | [ghostsecurity.com](https://ghostsecurity.com/) | ./reaper binary |

**Category:** Unified Application Security Testing Platform (DAST)

**Capabilities:**
- Reconnaissance (domain scanning)
- Request Proxying (traffic interception)
- Request Tampering (attack vector exploration)
- Active Testing (autonomous attack selection)
- Vulnerability Validation (PoC confirmation)
- Reporting (automated)

**AI Integration:** Autopilot (AI-only) and Co-op (human-in-the-loop) modes

**License:** Apache 2.0

---

## NOT INSTALLED (Documentation Corrections)

The following tools were previously documented but are **NOT** present:

| Tool | Container | Status |
|------|-----------|--------|
| Burp Suite | kali-pentest | **NOT INSTALLED** (commercial) |
| OWASP ZAP | kali-pentest | **NOT INSTALLED** (GUI required) |
| amass | kali-pentest | **NOT INSTALLED** |
| tshark/wireshark | kali-pentest | **NOT INSTALLED** |
| gobuster | kali-pentest | **NOT INSTALLED** (use ffuf) |
| masscan | kali-pentest | **NOT INSTALLED** (use naabu) |
| rustscan | kali-pentest | **NOT INSTALLED** (use naabu) |
| Grype | cloud-security | **NOT INSTALLED** (use Trivy) |
| Syft | cloud-security | **NOT INSTALLED** (use Trivy) |
| TextAttack | textattack | Installed — isolated container (numpy<2.0) |
| apksigner | mobile-tools | **NOT INSTALLED** |
| MobSF | mobile-tools | **NOT INSTALLED** (GUI required) |
| BloodHound | ad-security | **NOT INSTALLED** (GUI) |
| SharpHound | ad-security | **NOT INSTALLED** (Windows only) |

---

## Reference Frameworks

| Framework | Source | Used For |
|-----------|--------|----------|
| **MITRE ATT&CK** | [attack.mitre.org](https://attack.mitre.org/) | Threat modeling, attack mapping |
| **OWASP Top 10** | [owasp.org/Top10](https://owasp.org/Top10/) | Web vulnerability classification |
| **CWE** | [cwe.mitre.org](https://cwe.mitre.org/) | Weakness enumeration |
| **NIST NVD** | [nvd.nist.gov](https://nvd.nist.gov/) | CVE database |
| **CISA KEV** | [cisa.gov/known-exploited-vulnerabilities-catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | Known exploited vulnerabilities |
| **PTES** | [pentest-standard.org](http://www.pentest-standard.org/) | Pentest methodology |
| **OWASP WSTG** | [owasp.org/www-project-web-security-testing-guide](https://owasp.org/www-project-web-security-testing-guide/) | Web security testing guide |

---

## Verification Commands

To re-verify installed tools:

```bash
# SSH to VPS
ssh -i ~/.ssh/gro_256 -p 2222 debian@15.204.218.153

# Check specific container
docker run --rm <container>:latest which <tool>

# List Go binaries
docker run --rm kali-pentest:latest ls /root/go/bin/

# Check pip packages
docker run --rm <container>:latest pip list | grep -i <package>
```

---

**Framework:** Intelligence Adjacent (IA)
**Verified:** 2025-12-24
**VPS:** OVHcloud (15.204.218.153)
