#!/bin/sh
# A no-op, on purpose. Not a skill — a shim.
#
# On 21 September 2026 a session registered a UserPromptSubmit hook at this path before the file
# existed. A prompt hook that exits non-zero blocks the prompt, so every message came back as
# "A hook blocked your prompt" and that session could not be reached to undo it.
#
# Any container still carrying that registration runs this file and gets a clean exit, so prompts
# work. Do not delete it while a settings file anywhere might still point here, and do not put
# behaviour in it: the skill it was named for was never installed.
exit 0
