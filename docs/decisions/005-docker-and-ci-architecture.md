# ADR-005: Docker and CI/CD Architecture

## Status
Accepted

## Context
The test suites need a running instance of the AUT. The AUT (cypress-realworld-app) is a Node.js app with a SQLite database. We need it to run consistently in both local development and CI.

## Decision
- Include the AUT as a Git submodule in `apps/cypress-realworld-app/`
- Use Docker Compose with a custom `Dockerfile.aut` to build and run the AUT
- Use port mapping (`3000:3000`, `3001:3001`) instead of `network_mode: host`
- Run 4 separate GitHub Actions workflows (one per framework)
- Each workflow builds the Docker image, starts the AUT, runs tests, and tears down

## Key technical decisions

### Port mapping over host networking
We initially used `network_mode: host` which works on Linux CI runners but not on Windows/Mac Docker Desktop. Port mapping is more portable and works everywhere.

### Vite `--host` flag
The AUT uses Vite for the frontend dev server, which defaults to `127.0.0.1`. Inside a Docker container with port mapping, this means the frontend is unreachable from outside. The Dockerfile overrides the start command to run `vite --host` which binds to `0.0.0.0`.

### Separate workflows per framework
Each framework has its own workflow file instead of a single monolithic pipeline. This provides:
- Independent failure isolation (Selenium failing doesn't block Playwright results)
- Parallel execution (all 4 run simultaneously)
- Easier maintenance (each workflow is self-contained)

### `.dockerignore` for build performance
The build context excludes `node_modules/`, test files, and other non-essential files. This reduced the Docker build context from ~450MB to ~15MB.

## Tradeoffs
- 4 separate workflows means 4 Docker builds (could be optimized with a shared image)
- Port mapping requires the Vite `--host` workaround
- Git submodule adds complexity to the clone process (`--recurse-submodules`)
