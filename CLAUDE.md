# CLAUDE.md

## Project Overview

This repository contains the capstone project for the FlyRank AI-assisted
development internship track.

The project is developed primarily in GitHub Codespaces, using Claude Code
through the integrated terminal.

## Development Environment

- Runtime: Node.js LTS
- Package manager: npm
- Version control: Git and GitHub
- Development environment: GitHub Codespaces
- Editor: Visual Studio Code for the Web
- AI development assistant: Claude Code

## Project Conventions

### JavaScript and TypeScript

- Prefer TypeScript for application source code.
- Use modern ECMAScript syntax.
- Use `const` by default and `let` only when reassignment is required.
- Avoid `any` unless there is a documented reason.
- Keep functions small and focused on one responsibility.
- Use descriptive names rather than abbreviations.

### File Organization

- Store application code in `src/`.
- Store automated tests in `tests/` or next to source files as `*.test.ts`.
- Store documentation in `docs/` when it grows beyond the README.
- Do not commit generated files, dependencies, secrets, or local environment
  files.

### Quality Requirements

Before considering a task complete:

1. Run the relevant tests.
2. Run linting and type checking when configured.
3. Review the Git diff for unrelated changes.
4. Update documentation when behavior or setup changes.
5. Never expose credentials, API keys, tokens, or private data.

### Git Conventions

All commits must follow Conventional Commits 1.0.0:

`<type>[optional scope]: <description>`

Common commit types:

- `feat`: introduce user-facing functionality
- `fix`: correct faulty behavior
- `docs`: change documentation only
- `test`: add or modify tests
- `refactor`: restructure code without changing behavior
- `chore`: perform maintenance or repository setup
- `ci`: change continuous-integration configuration

Examples:

- `feat(api): add keyword analysis endpoint`
- `fix(parser): handle empty content`
- `docs: improve local setup instructions`
- `test: cover content scoring edge cases`
- `chore: configure development environment`

Commit descriptions should be imperative, concise, and lowercase.

### AI Assistant Instructions

- Read this file and the README before modifying the project.
- Explain significant assumptions before implementing complex changes.
- Make the smallest change that fully solves the requested task.
- Do not modify unrelated files.
- Do not add a dependency when the standard library is sufficient.
- Show the files changed and the validation performed.
- Ask before performing destructive Git operations. 
