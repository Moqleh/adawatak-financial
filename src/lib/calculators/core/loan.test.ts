import { describe, expect, it } from "vitest";
import { Decimal, M } from "@/lib/money";
import { CalculatorError } from "../errors";
import { calcLoanCore, type AmortizationRow } from "./loan";

const monthly = (annualPct: string): Decimal =>
  new Decimal(annualPct).div(100).div(12);

function expectInvalidInput(fn: () => unknown, field: string): void {
  try {
    fn();
    expect.fail("expected CalculatorError to be thrown");
  } catch (e) {
    expect(e).toBeInstanceOf(CalculatorError);
    const err = e as CalculatorError;
    expect(err.code).toBe("INVALID_INPUT");
    expect((err.details as { field?: string } | undefined)?.field).toBe(field);
  }
}

function assertScheduleInvariants(
  schedule: AmortizationRow[],
  principal: Decimal,
): void {
  expect(schedule.length).toBeGreaterThan(0);
  expect(schedule[0].openingBalance.equals(principal)).toBe(true);

  let sumPrincipal = new Decimal(0);

  for (let k = 0; k < schedule.length; k++) {
    const row = schedule[k];

    if (k > 0) {
      expect(
        row.openingBalance.equals(schedule[k - 1].closingBalance),
      ).toBe(true);
    }

    const reconstructedPayment = row.principal.plus(row.interest);
    const isPaymentMatch = row.payment.equals(reconstructedPayment);

    if (!isPaymentMatch) {
      console.log("=== FIRST FAILING PAYMENT DIAGNOSTICS ===", {
        month: row.month,
        payment: row.payment.toString(),
        principal: row.principal.toString(),
        interest: row.interest.toString(),
        sum: reconstructedPayment.toString(),
        diff: row.payment.minus(reconstructedPayment).toString(),
      });
    }

    expect(isPaymentMatch).toBe(true);

    expect(
      row.closingBalance.equals(row.openingBalance.minus(row.principal)),
    ).toBe(true);

    sumPrincipal = sumPrincipal.plus(row.principal);
  }

  expect(sumPrincipal.equals(principal)).toBe(true);
  expect(schedule[schedule.length - 1].closingBalance.isZero()).toBe(true);
}

describe("calcLoanCore — schedule invariants", () => {
  const cases: Array<{ P: string; annual: string; n: number }> = [
    { P: "100000", annual: "5", n: 60 },
    { P: "250000", annual: "6.5", n: 240 },
    { P: "10000000", annual: "4.25", n: 360 },
    { P: "12000", annual: "0", n: 12 },
  ];

  for (const { P, annual, n } of cases) {
    it(`P=${P}, annual=${annual}%, months=${n}`, () => {
      const { schedule } = calcLoanCore({
        principal: M(P),
        monthlyRate: monthly(annual),
        months: n,
      });

      expect(schedule).toHaveLength(n);
      assertScheduleInvariants(schedule, M(P));
    });
  }

  it("Σ payment = Σ principal + Σ interest", () => {
    const { schedule } = calcLoanCore({
      principal: M("250000"),
      monthlyRate: monthly("6.5"),
      months: 240,
    });

    let sumPayment = new Decimal(0);
    let sumPrincipal = new Decimal(0);
    let sumInterest = new Decimal(0);

    for (const row of schedule) {
      sumPayment = sumPayment.plus(row.payment);
      sumPrincipal = sumPrincipal.plus(row.principal);
      sumInterest = sumInterest.plus(row.interest);
    }

    expect(sumPayment.equals(sumPrincipal.plus(sumInterest))).toBe(true);
  });
});

describe("calcLoanCore — edge cases", () => {
  it("months = 1 → row واحد، principal = P، closing = 0", () => {
    const P = M("1000");
    const { schedule } = calcLoanCore({
      principal: P,
      monthlyRate: monthly("5"),
      months: 1,
    });

    expect(schedule).toHaveLength(1);
    expect(schedule[0].principal.equals(P)).toBe(true);
    expect(schedule[0].closingBalance.isZero()).toBe(true);
    expect(schedule[0].openingBalance.equals(P)).toBe(true);
  });

  it("rate = 0 → interest = 0 في كل صف", () => {
    const { schedule } = calcLoanCore({
      principal: M("12000"),
      monthlyRate: M("0"),
      months: 12,
    });

    for (const row of schedule) {
      expect(row.interest.isZero()).toBe(true);
    }
  });

  it("P = 1, rate = 0, months = 1 → أصغر حالة", () => {
    const { schedule } = calcLoanCore({
      principal: M("1"),
      monthlyRate: M("0"),
      months: 1,
    });

    assertScheduleInvariants(schedule, M("1"));
  });

  it("P = 0 → يرفض INVALID_INPUT (principal)", () => {
    expectInvalidInput(
      () =>
        calcLoanCore({
          principal: M("0"),
          monthlyRate: monthly("5"),
          months: 12,
        }),
      "principal",
    );
  });

  it("P < 0 → يرفض INVALID_INPUT (principal)", () => {
    expectInvalidInput(
      () =>
        calcLoanCore({
          principal: M("-100"),
          monthlyRate: monthly("5"),
          months: 12,
        }),
      "principal",
    );
  });

  it("rate < 0 → يرفض INVALID_INPUT (monthlyRate)", () => {
    expectInvalidInput(
      () =>
        calcLoanCore({
          principal: M("1000"),
          monthlyRate: new Decimal("-0.01"),
          months: 12,
        }),
      "monthlyRate",
    );
  });

  it("months = 0 → يرفض INVALID_INPUT (months)", () => {
    expectInvalidInput(
      () =>
        calcLoanCore({
          principal: M("1000"),
          monthlyRate: monthly("5"),
          months: 0,
        }),
      "months",
    );
  });

  it("months غير صحيح (12.5) → يرفض INVALID_INPUT (months)", () => {
    expectInvalidInput(
      () =>
        calcLoanCore({
          principal: M("1000"),
          monthlyRate: monthly("5"),
          months: 12.5,
        }),
      "months",
    );
  });
});
