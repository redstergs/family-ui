# Integration and release contract

Family UI is **build-time-only**. No cross-product runtime scripts, shared services, identities or data sources.

## Planned distribution
1. Finalize stable token names and CSS components.
2. Publish a tagged SemVer release.
3. Each consumer pins a specific version in its build and upgrades independently.
4. Regressions and accessibility are checked inside the consuming app before deployment.

Initial package is marked **private** and **0.1.0** for development. No registry publish or app migration has happened.

## Adoption order
1. Family MCP admin frontend (UI only; do not touch OAuth, worker routes, sync, D1).
2. Family Food.
3. Family Workout (may use thin React wrappers, without enforcing React elsewhere).
4. Family Door only after carefully checking existing ergonomics and the safety-critical door flow.

## Security
The playground has simulated state only. There is no live door control, cloud API request or token handling.
