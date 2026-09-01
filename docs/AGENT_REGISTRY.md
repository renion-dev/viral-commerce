# Agent Registry

## Active Agents

| ID | Role | File | Status |
|----|------|------|--------|
| ceo | CEO / Chief Orchestrator | `agents/ceo-orchestrator.md` | Active |
| signal | Signal Hunter | `agents/signal-hunter.md` | Active |
| creative | Creative Director | `agents/creative-director.md` | Active |
| frontend | Frontend Engineer | `agents/frontend-engineer.md` | Active |
| qa | QA Engineer | `agents/qa-engineer.md` | Active |

## Agent Contracts

Each agent has a defined contract covering:
- **Mission** — What they're trying to achieve
- **Responsibilities** — Specific tasks they own
- **Inputs** — What they need to work
- **Outputs** — What they produce
- **Tools** — What they can use
- **Success Criteria** — How to measure them
- **Failure Conditions** — When to intervene
- **Constraints** — Hard limits

## Adding New Agents

1. Create `agents/<name>.md` with full contract
2. Update this registry
3. Update Orchestrator
4. Announce to organization

## MVP Rationale

5 agents chosen as minimum viable organization:
- **CEO** — Coordination (no implementation)
- **Signal** — Intelligence (what to build)
- **Creative** — Content (what to say)
- **Frontend** — Implementation (build it)
- **QA** — Quality (verify it)

Post-MVP additions planned: Backend Engineer, Data Engineer, DevOps Engineer, Growth Engineer.
