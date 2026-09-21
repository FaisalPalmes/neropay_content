#!/usr/bin/env python3
"""Remove hook entries whose script is not on disk, from every settings file this session reads.

Why this exists. On 21 September 2026 a session registered a `UserPromptSubmit` hook pointing at
`.claude/skills/planning-with-files/hooks/claude-hook.sh` before that file existed. A prompt hook that
exits non-zero blocks the prompt, so every message Faisal typed came back as "A hook blocked your prompt"
and the session could not be talked to — including to tell it to undo the hook. The only way out was
editing the settings file by hand from another session.

So: at every session start, each settings file is checked and any hook whose command names a script that
is missing is dropped. Nothing else is touched; a hook whose script exists is left exactly as it is. The
file is copied to `<name>.before-prune.json` the first time it is changed.

  python3 .claude/hooks/prune-dead-hooks.py [project_dir]
"""
import json, os, re, shutil, sys

root = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())
home = os.path.expanduser('~')
FILES = [os.path.join(root, '.claude/settings.json'),
         os.path.join(root, '.claude/settings.local.json'),
         os.path.join(home, '.claude/settings.json'),
         os.path.join(home, '.claude/settings.local.json')]

SCRIPT = re.compile(r'\.(sh|py|js|mjs|cjs|ts|bash|zsh)$')


def script_path(command, root):
    """The script a hook command runs, or None when the command is not a script call we can resolve."""
    text = (command or '').replace('$CLAUDE_PROJECT_DIR', root).replace('${CLAUDE_PROJECT_DIR}', root)
    text = text.replace('$HOME', home).replace('${HOME}', home)
    # stop at the first shell operator: only the leading command is ours to judge
    text = re.split(r'[;&|]|\n', text)[0]
    for token in text.split():
        token = token.strip('"\'')
        if token.startswith('~/'):
            token = os.path.join(home, token[2:])
        if SCRIPT.search(token) and '/' in token:
            return token if os.path.isabs(token) else os.path.join(root, token)
    return None


def prune(path):
    if not os.path.isfile(path):
        return []
    try:
        with open(path) as fh:
            data = json.load(fh)
    except (json.JSONDecodeError, OSError):
        return []
    if not isinstance(data.get('hooks'), dict):
        return []
    dropped = []
    for event, matchers in list(data['hooks'].items()):
        if not isinstance(matchers, list):
            continue
        kept_matchers = []
        for matcher in matchers:
            if not isinstance(matcher, dict) or not isinstance(matcher.get('hooks'), list):
                kept_matchers.append(matcher)
                continue
            kept = []
            for hook in matcher['hooks']:
                target = script_path(hook.get('command'), root) if isinstance(hook, dict) else None
                if target and not os.path.exists(target):
                    dropped.append((event, target))
                    continue
                kept.append(hook)
            if kept:
                matcher['hooks'] = kept
                kept_matchers.append(matcher)
        if kept_matchers:
            data['hooks'][event] = kept_matchers
        else:
            del data['hooks'][event]
    if dropped:
        shutil.copyfile(path, path.replace('.json', '.before-prune.json'))
        with open(path, 'w') as fh:
            json.dump(data, fh, indent=2)
            fh.write('\n')
    return dropped


found = [(path, d) for path in FILES for d in [prune(path)] if d]
for path, dropped in found:
    print(f"  !! {path}: removed {len(dropped)} hook(s) whose script is missing —")
    for event, target in dropped:
        print(f"     {event} -> {target}")
    print(f"     the file as it was is beside it as {os.path.basename(path).replace('.json', '.before-prune.json')}")
