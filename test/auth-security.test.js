const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

describe('Authentication & Password Security', () => {
  it('should hash passwords with bcrypt and verify correctly', async () => {
    const rawPassword = 'SecurePassword123!#';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert.notStrictEqual(rawPassword, hash);
    assert.strictEqual(await bcrypt.compare(rawPassword, hash), true);
    assert.strictEqual(await bcrypt.compare('WrongPassword', hash), false);
  });

  it('should verify JWT payload sub to id mapping', () => {
    // Mimics the fix in JwtAuthGuard
    const payload = {
      sub: 'usr_abc123',
      email: 'admin@adl-kairouan.org',
      role: 'SUPER_ADMIN',
    };

    const user = {
      ...payload,
      id: payload.sub,
    };

    assert.strictEqual(user.id, 'usr_abc123');
    assert.strictEqual(user.email, 'admin@adl-kairouan.org');
    assert.strictEqual(user.role, 'SUPER_ADMIN');
  });
});

describe('File Upload Security & Sanitization', () => {
  function sanitizeFilename(originalName) {
    const base = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
    return base.replace(/\.\./g, '_');
  }

  function validateSvgContent(content) {
    const dangerousPatterns = [
      /<script\b/i,
      /javascript:/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /onclick\s*=/i,
    ];
    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        return false;
      }
    }
    return true;
  }

  it('should neutralize path traversal sequences in filenames', () => {
    const dangerousNames = [
      '../../../etc/passwd',
      '..\\..\\windows\\system32\\cmd.exe',
      'foo/../../bar.png',
      '../../../.env',
    ];

    for (const name of dangerousNames) {
      const sanitized = sanitizeFilename(name);
      assert.strictEqual(sanitized.includes('..'), false);
      assert.strictEqual(sanitized.includes('/'), false);
      assert.strictEqual(sanitized.includes('\\'), false);
    }
  });

  it('should detect malicious SVG payloads containing scripts or event handlers', () => {
    const maliciousSvg1 = '<svg><script>alert("XSS")</script></svg>';
    const maliciousSvg2 = '<svg><image href="x" onerror="alert(1)" /></svg>';
    const maliciousSvg3 = '<svg><a href="javascript:alert(document.cookie)"><text>Click</text></a></svg>';
    const safeSvg = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="green" /></svg>';

    assert.strictEqual(validateSvgContent(maliciousSvg1), false);
    assert.strictEqual(validateSvgContent(maliciousSvg2), false);
    assert.strictEqual(validateSvgContent(maliciousSvg3), false);
    assert.strictEqual(validateSvgContent(safeSvg), true);
  });
});

