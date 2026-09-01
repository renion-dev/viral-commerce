# The Signal — Viral 3D Commerce Platform

> A living digital world that transforms emerging cultural signals into interactive commerce experiences.

## Status

🟡 **MVP Development** — Project structure complete, building MVP.

## Quick Start

```bash
# Clone
git clone <repo-url>
cd viral-commerce

# Serve locally (Python)
python3 -m http.server 8000

# Or use any static file server
npx serve website/
```

## Project Structure

```
viral-commerce/
├── docs/              # Documentation
├── agents/            # Agent contracts
├── orchestration/     # Orchestrator config
├── website/           # Frontend code (Three.js)
├── data/              # World state JSON
├── experiments/       # Experiment configs
├── content/           # Generated content
├── tests/             # Test suite
└── ops/               # Operations scripts
```

## Architecture

- **Frontend:** Three.js + vanilla JS (no build step)
- **Content:** JSON files (git-versioned)
- **Hosting:** Vercel (free tier)
- **AI:** Nous Inference API (free)
- **Analytics:** Lightweight custom

## Team

| Agent | Role |
|-------|------|
| CEO Orchestrator | Coordination |
| Signal Hunter | Trend discovery |
| Creative Director | Content generation |
| Frontend Engineer | 3D development |
| QA Engineer | Quality assurance |

## Constraints

- **$0 budget** — everything is free
- **Autonomous** — minimal human intervention
- **Viral by design** — sharing is a feature

## License

MIT
