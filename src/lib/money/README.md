# Money Layer

- `Money = Decimal` is internal to the financial domain.
- Client/API/JSON boundaries use `MoneyDTO = string` through `toDTO` / `fromDTO`.
- No calculation uses `toFixed` or `Math.round`; formatting is display-only.
- Decimal uses precision 28 and ROUND_HALF_EVEN.
- `adjustFinalPayment` requires exact equality between final balance and principal deficit.
- Any invariant break raises `ScheduleInvariantError`.
- Amortization rows are not rounded. A future cash-rounding mode must be explicit and separately documented.
