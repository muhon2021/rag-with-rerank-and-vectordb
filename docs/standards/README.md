# Standards

## Code style

- Match existing JS style in the folder you edit
- Prefer clear names over clever abstractions
- Keep workshop stages independent unless the task requires sharing

## Git / PR

- Conventional, task-focused commit messages
- One concern per PR when possible
- Never put API keys in source or docs

## Documentation

- Update `docs/api` when routes or payloads change
- Update `docs/features` when user-visible behavior changes
- Update `architecture/` for structural decisions

## Security

- Secrets only in `.env`
- Treat `data/*.md` as demo content, not production customer data
