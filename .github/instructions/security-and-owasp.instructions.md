---
applyTo: '*'
description: "Secure coding instructions based on OWASP Top 10 and industry best practices."
---

# Secure Coding and OWASP Guidelines

## Core Security Principles

Always default to the most restrictive permissions and follow a "deny by default" pattern. When generating code, prioritize security over convenience and explicitly explain security measures.

## OWASP Top 10 Guidelines

### 1. Broken Access Control & SSRF
- **Least Privilege:** Default to most restrictive permissions; explicitly check user rights
- **Deny by Default:** Access only granted with explicit rules
- **URL Validation:** Treat user-provided URLs as untrusted; use strict allow-lists
- **Path Traversal Prevention:** Sanitize file paths to prevent `../../` attacks

### 2. Cryptographic Failures
- **Modern Algorithms:** Use Argon2 or bcrypt for passwords; never MD5 or SHA-1
- **HTTPS Only:** Always default to HTTPS for network requests
- **Encrypt at Rest:** Use AES-256 for sensitive data storage
- **Secret Management:** Never hardcode secrets; use environment variables or secret stores
  ```csharp
  // GOOD: Load from environment
  var apiKey = Environment.GetEnvironmentVariable("API_KEY");
  
  // BAD: Hardcoded secret
  var apiKey = "sk_this_is_bad_12345";
  ```

### 3. Injection Attacks
- **Parameterized Queries:** Always use for database interactions; never string concatenation
- **Command Escaping:** Use built-in argument escaping for OS commands
- **XSS Prevention:** Use context-aware output encoding; prefer `.textContent` over `.innerHTML`
- **Input Validation:** Validate and sanitize all external input

### 4. Security Misconfiguration
- **Secure Defaults:** Disable verbose errors and debug features in production
- **Security Headers:** Add CSP, HSTS, X-Content-Type-Options headers
- **Dependency Scanning:** Use `npm audit`, `pip-audit`, or Snyk regularly
- **Latest Versions:** Keep dependencies updated

### 5. Authentication Failures
- **Session Management:** Generate new session IDs on login; use `HttpOnly`, `Secure`, `SameSite=Strict`
- **Rate Limiting:** Implement account lockout after failed attempts
- **Strong Credentials:** Enforce strong password policies

### 6. Data Integrity Failures
- **Deserialization:** Never deserialize untrusted data without validation
- **Type Checking:** Use safe formats (JSON over Pickle) with strict type checking

## Best Practices

### Input Validation
- Validate all user input at entry points
- Use allow-lists over deny-lists
- Validate data type, length, format, and range

### Error Handling
- Never expose stack traces or internal errors to users
- Log detailed errors securely for debugging
- Return generic error messages to clients

### Security Testing
- Integrate security scanning in CI/CD pipeline
- Use SAST tools for code analysis
- Perform regular penetration testing
- Scan dependencies for vulnerabilities

### Secure Configuration
```csharp
// ASP.NET Core security headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'");
    await next();
});
```

## Code Review Checklist
- [ ] No hardcoded secrets or credentials
- [ ] Parameterized queries used for database access
- [ ] User input validated and sanitized
- [ ] Authentication and authorization properly implemented
- [ ] HTTPS enforced for all external communications
- [ ] Security headers configured
- [ ] Error messages don't expose sensitive information
- [ ] Dependencies scanned for vulnerabilities
- [ ] Sensitive data encrypted at rest and in transit
- [ ] Logging doesn't include sensitive information
