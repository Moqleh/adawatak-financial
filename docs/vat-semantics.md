# VAT Semantics

Two modes are supported.

## add
Input is `netAmount`.
- vat = netAmount × rate
- gross = netAmount + vat

## remove
Input is `grossAmount`.
- net = grossAmount / (1 + rate)
- vat = grossAmount - net

The ambiguous `extract` mode is removed from the new API. The legacy compatibility wrapper maps `extract` to `remove`; all legacy call sites must be reviewed before merge. VAT rate is always an input and is never hardcoded.
