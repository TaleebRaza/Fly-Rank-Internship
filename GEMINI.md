# GEMINI.md

## Project Overview

This repository contains my capstone project for the FlyRank AI-assisted
development internship track.

The project is developed primarily in GitHub Codespaces using Gemini CLI.

## Technology Stack

- Runtime: Node.js LTS
- Package manager: npm
- Version control: Git and GitHub
- Development environment: GitHub Codespaces
- Editor: Visual Studio Code for the Web
- AI assistant: Gemini CLI

## Development Conventions

- Prefer TypeScript for application source code.
- Use modern ECMAScript syntax.
- Use `const` by default and `let` only when reassignment is required.
- Use clear and descriptive variable and function names.
- Keep functions small and focused.
- Do not commit API keys, credentials, tokens, or `.env` files.
- Avoid unnecessary dependencies.
- Update documentation when setup or behavior changes.

## Project Structure

- Store application code in `src/`.
- Store tests in `tests/` or beside source files as `*.test.ts`.
- Store extended documentation in `docs/`.
- Do not commit generated files or installed dependencies.

## Validation

Before completing a task:

1. Review the changed files.
2. Run available tests.
3. Run linting and type checking when configured.
4. Check for unrelated changes.
5. Confirm that no secrets are included.

## Git Conventions

All commits must follow Conventional Commits:

`<type>[optional scope]: <description>`

Common types:

- `feat`: add functionality
- `fix`: correct faulty behavior
- `docs`: update documentation
- `test`: add or modify tests
- `refactor`: restructure code without changing behavior
- `chore`: repository maintenance
- `ci`: continuous-integration changes

Examples:

- `feat: add initial application`
- `fix: handle missing configuration`
- `docs: improve setup instructions`
- `chore: configure repository files`

Commit descriptions must be concise, imperative, and lowercase.

## AI Assistant Instructions

- Read `README.md` and this file before changing the project.
- Make the smallest change that fully solves the task.
- Do not modify unrelated files.
- Explain important assumptions.
- Summarize the files changed.
- State what validation was performed.
- Do not create Git commits unless explicitly requested.
