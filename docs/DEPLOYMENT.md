# Deployment

## Current Deployment

| Item | Value |
|------|-------|
| **URL** | https://temporary-instant-boron-7b3yap3.vercel.app |
| **Platform** | Vercel (free tier) |
| **Status** | ✅ Active |
| **HTTPS** | ✅ Automatic |
| **SSL** | ✅ Automatic |
| **Type** | Temporary (60 min) — needs claim or re-deploy |

## Deployment History

| Date | Commit | URL | Status |
|------|--------|-----|--------|
| 2026-09-01 | 5ed8084 | https://temporary-instant-boron-7b3yap3.vercel.app | Active (temp) |

## Platform Limits

| Resource | Limit | Current |
|----------|-------|---------|
| Bandwidth | 100GB/month | ~0.1GB |
| Build minutes | 6000/month | 0 (static) |
| Serverless functions | 100GB-hours | 0 |
| Team members | 1 (free) | 1 |

## Deployment Process

1. Push to GitHub (when repo created)
2. Vercel auto-deploys on push
3. Verify deployment URL
4. Check HTTPS + content loading

## Next Steps

- [ ] Create GitHub repo
- [ ] Connect Vercel to GitHub
- [ ] Set up custom domain (optional, free)
- [ ] Configure environment variables
- [ ] Set up monitoring

## Rollback

If deployment fails:
1. Check Vercel dashboard logs
2. Revert last commit
3. Push to trigger re-deploy
4. Verify fix
