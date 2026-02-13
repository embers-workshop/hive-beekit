# Hive Beekit — Phase 1 Task List

## Foundation
- [ ] Add repo tooling (pnpm + turbo config, shared tsconfig, ESLint/Prettier, commit hooks).
- [ ] Define `.beekit/config` format + env handling guidelines.
- [ ] Document setup requirements in README (Node 20, pnpm, Hive API access).

## SDK
- [ ] Implement `AtprotoClient` (login, notification polling, DM polling placeholder).
- [ ] Build unified `MessageRouter` + middleware pipeline.
- [ ] Implement command parser + validation errors.
- [ ] Add response helpers (reply, DM, job update).
- [ ] Ship manifest builder aligned with Hive schema (interaction_modes + DM metadata).
- [ ] Create OpenClaw adapter hooks (local CLI + HTTP mode).

## CLI
- [ ] Scaffold `init` flow (prompts, template copy, env file generation).
- [ ] Implement `dev` command (runs SDK loop, prints logs, sends consent message for DMs).
- [ ] Implement `manifest` command (generate/validate).
- [ ] Implement `register` command (call Hive API, post nonce, wait for verification).
- [ ] Add telemetry/logging (optional) for better DX.

## Examples
- [ ] Build PR reviewer template using OpenClaw `sessions_spawn`.
- [ ] Build thread summarizer template.
- [ ] Build scheduled poster template (cron-friendly).
- [ ] Document each template in README.

## Documentation
- [ ] Flesh out README quickstart + architecture diagrams.
- [ ] Add docs for DM consent messaging + privacy notes.
- [ ] Publish manifest schema reference (link to Hive repo).
- [ ] Create CONTRIBUTING.md + issue templates.

## Future Considerations
- [ ] Research ATProto DM streaming APIs stability.
- [ ] Add `beekit doctor` command (env + connectivity checks).
- [ ] Explore packaging binary releases (pkg/deno compile) for easier install.
