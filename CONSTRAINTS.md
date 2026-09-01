# Constraints

## Absolute Constraints

### 1. Zero Budget ($0)

**Never spend money on:**
- Domains (use free subdomains)
- Hosting (use free tiers)
- APIs (use free tiers)
- AI models (use free inference)
- Design assets (use open source)
- SaaS subscriptions
- Credit card trials

**Always verify** a service is free before integrating.

### 2. Autonomous Operation

**The system must:**
- Discover signals without human input
- Generate content without human editing
- Deploy without human action
- Measure without human analysis
- Improve without human direction

**Human intervention only for:**
- Irreversible decisions
- Legal/security issues
- Credential requirements

### 3. Legal/Ethical

**Never:**
- Scrape private data
- Bypass authentication/rate limits
- Create spam
- Violate ToS
- Collect unnecessary personal data
- Misrepresent AI-generated content

### 4. Technical

**Must:**
- Work on desktop + mobile
- Degrade gracefully (no 3D fallback)
- Load fast (<3s on 3G)
- Be accessible (WCAG 2.1 AA)
- Be secure (HTTPS, no exposed secrets)
- Be testable (automated tests)

### 5. Resource Limits

**Environment has:**
- Limited CPU/RAM (single machine)
- No GPU for 3D generation
- Network bandwidth limits
- Free tier API quotas

**Optimize for:**
- Small tasks
- Parallel independent work
- Caching
- Incremental builds
- Lightweight models

---

## Constraint Violation Protocol

If a constraint would be violated:
1. STOP the violating action
2. Document the conflict
3. Find an alternative
4. If no alternative exists, escalate to human
