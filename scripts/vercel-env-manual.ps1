# Retired: this guide previously printed provider credentials from source.
#
# Credential values belong only in the approved provider secret store.

$ErrorActionPreference = "Stop"

throw @"
This manual credential guide is retired and intentionally fails closed.

Use the approved Vercel project settings or an authorized secret-management
runbook. Confirm the project and environment scope without displaying values.
Do not store credential values in repository files, documentation, or scripts.
"@
