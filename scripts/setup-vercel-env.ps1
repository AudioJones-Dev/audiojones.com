# Retired: this script previously embedded provider credentials in source.
#
# Configure server-only credentials through the approved provider secret store.
# Never place credential values in repository files, command history, or logs.

$ErrorActionPreference = "Stop"

throw @"
This credential setup script is retired and intentionally fails closed.

Use the approved Vercel project settings or an authorized secret-management
workflow. Verify the project, environment scope, and credential owner before
making any provider change. Do not paste credential values into this file.
"@
