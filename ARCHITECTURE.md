# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SIGNAL ENGINE                         │
│  (Trends, Social, Search, News → Signal objects)        │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 OPPORTUNITY ENGINE                       │
│  (Score → Rank → Select opportunities)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  CONTENT ENGINE                          │
│  (Generate → Review → Publish content)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   WORLD STATE                            │
│  (JSON document describing current world)               │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  3D FRONTEND                             │
│  (Three.js → Render world state → User interaction)     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  ANALYTICS                               │
│  (Track → Measure → Learn → New experiments)            │
└─────────────────────────────────────────────────────────┘
```

## Technology Layer

| Layer | Technology | Cost |
|-------|-----------|------|
| **Frontend** | Three.js + vanilla JS | Free |
| **Content** | JSON files + static generation | Free |
| **Hosting** | Vercel (static) | Free |
| **CI/CD** | GitHub Actions | Free |
| **Analytics** | GoatCounter or custom lightweight | Free |
| **AI** | Nous Inference API | Free |
| **Trends** | Google Trends, HN, Reddit | Free |

## Data Model

### World State (single source of truth)

```json
{
  "world": {
    "id": "future-running-2026",
    "name": "Future Running",
    "trend_score": 91,
    "active_since": "2026-09-01",
    "products": ["p1", "p2", "p3"],
    "stories": ["s1", "s2"],
    "visuals": ["v1", "v2", "v3"],
    "experiments": ["e1"]
  }
}
```

### Entity Types

| Entity | Description |
|--------|-------------|
| `Signal` | Raw detected trend/topic |
| `Opportunity` | Scored commercial possibility |
| `Campaign` | Active marketing campaign |
| `Product` | Product/offer to display |
| `Story` | Narrative content piece |
| `Visual` | 3D asset / visual element |
| `Experiment` | A/B test configuration |
| `UserArtifact` | User-generated shareable |

## Deployment Architecture

```
GitHub Repo → GitHub Actions → Vercel Edge Network → Users
                    │
                    └── Runs signal discovery cron
```

## File Structure

```
viral-commerce/
├── docs/                    # Documentation
├── agents/                  # Agent contracts
├── orchestration/           # Orchestrator config
├── website/                 # Frontend code
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── data/                    # World state JSON
├── experiments/             # Experiment configs
├── content/                 # Generated content
├── ops/                     # Operations scripts
└── tests/                   # Test suite
```

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| 3D Library | Three.js | Mature, free, huge community |
| Framework | Vanilla JS | Zero build complexity, fastest load |
| Content | JSON files | No CMS needed, git-versioned |
| Hosting | Vercel | Best free tier for static |
| Analytics | Lightweight custom | Privacy-first, zero cost |
| AI | Nous Inference | Free, capable enough |
