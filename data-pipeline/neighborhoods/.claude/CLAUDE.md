# Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution.

## Project Scope

**County Neighborhood Profiles** — Generate comprehensive neighborhood/municipality profiles for upload to a real estate website. Covers the following counties in southeastern Wisconsin:

- **Waukesha County**
- **Milwaukee County**
- **Ozaukee County**
- **Washington County**

Each profile should be ready for web publishing — informative, locally relevant, and structured consistently across all municipalities.

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases

**Layer 2: Agents (The Decision-Maker)**
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- Credentials and API keys are stored in `.env`

## How to Operate

1. **Look for existing tools first** — Check `tools/` before building anything new
2. **Learn and adapt when things fail** — Read errors, fix scripts, document learnings in workflows
3. **Keep workflows current** — Update as you learn, but don't overwrite without asking

## File Structure

```
.claude/           # Agent instructions
workflows/         # Markdown SOPs
tools/             # Python scripts for execution
templates/         # HTML/content templates for profiles
output/            # Finished profiles organized by county
  waukesha-county/
  milwaukee-county/
  ozaukee-county/
  washington-county/
.tmp/              # Temporary/intermediate files (disposable)
.env               # API keys (NEVER store secrets anywhere else)
```

## Bottom Line

Stay pragmatic. Stay reliable. Keep learning.
