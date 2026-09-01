# Operations

## Deployment

**Platform:** Vercel (free tier)
**URL:** (pending deployment)
**SSL:** Automatic via Vercel
**CI/CD:** GitHub Actions

## Monitoring

- **Uptime:** Vercel Analytics
- **Performance:** Lighthouse CI
- **Errors:** Browser console + custom logging
- **Analytics:** GoatCounter or lightweight custom

## Backup

- **Code:** GitHub repository
- **Content:** Git-versioned JSON
- **State:** World state in `data/world-state.json`

## Security

- No secrets in code
- Environment variables via Vercel
- HTTPS enforced
- CSP headers configured
- Input validation on all user inputs

## Cost Tracking

| Service | Cost | Limit |
|---------|------|-------|
| Vercel | $0 | 100GB bandwidth |
| GitHub | $0 | Private repo |
| Nous Inference | $0 | Free tier |
| **Total** | **$0** | — |

## Maintenance

- World state updates: Automated via cron
- Content refresh: Automated via cron
- Dependency updates: Monthly review
| Security audit | Ongoing via QA Engineer
