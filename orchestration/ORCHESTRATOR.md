# Orchestrator

## Mission

Coordinate the autonomous development of The Signal — a viral 3D commerce platform.

## Current State

| Component | Status |
|-----------|--------|
| Project | Created |
| Audit | Complete |
| Vision | Defined |
| Architecture | Defined |
| Agents | 5 defined |
| Kanban | Pending |
| MVP | Not started |
| Deployment | Pending |

## Organization

```
CEO Orchestrator (this document)
├── Signal Hunter
├── Creative Director
├── Frontend Engineer
└── QA Engineer
```

## Task Lifecycle

```
IDEA → TODO → IN_PROGRESS → REVIEW → DONE
              ↓
         BLOCKED → retry/reassign
```

## Operating Cycles

### Signal Discovery (every 1 hour)
1. Signal Hunter scans sources
2. New signals stored in `data/signals/`
3. Opportunities scored
4. Top opportunities queued for content

### Content Generation (every 3 hours)
1. Creative Director picks top opportunity
2. Content package created
3. QA Engineer reviews
4. World state updated

### Deployment (on world state change)
1. Frontend Engineer builds
2. QA Engineer tests
3. Deploy to Vercel
4. Verify public URL

### Strategy Review (daily)
1. Analytics reviewed
2. Experiments evaluated
3. New opportunities prioritized
4. Backlog groomed

## Decision Log

| # | Decision | Date | Reason |
|---|----------|------|--------|
| 1 | Vanilla JS over React | 2026-09-01 | Zero build complexity, fastest load |
| 2 | Three.js for 3D | 2026-09-01 | Mature, free, huge community |
| 3 | Vercel for hosting | 2026-09-01 | Best free tier for static |
| 4 | 5 agents for MVP | 2026-09-01 | Minimum viable organization |
| 5 | JSON for content | 2026-09-01 | No CMS needed, git-versioned |

## Current Priorities

1. ✅ Environment audit
2. ✅ Project documentation
3. ✅ Agent contracts
4. ⬜ Initialize Kanban board
5. ⬜ First signal discovery
6. ⬜ MVP 3D scene
7. ⬜ Deploy to Vercel
8. ⬜ Activate autonomous cycles

## Communication Protocol

- Orchestrator creates tasks in Kanban
- Workers self-assign from Kanban
- Workers report completion via Kanban
- Blocked tasks escalated to Orchestrator
- All significant decisions logged here
