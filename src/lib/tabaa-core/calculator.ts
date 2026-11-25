// Copied from https://github.com/abderrahimghazali/tabaa (packages/core). Fixes go there first, then here.
import { Decimal } from "decimal.js";
import type { InvoiceTotals, LineInput, PaymentMethod } from "./types";
import type { RulePackage } from "./rules";

const money = (d: Decimal) => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

export function computeInvoice(
  lines: LineInput[],
  opts: { paymentMethod: PaymentMethod; rules: RulePackage },
): InvoiceTotals {
  const bases = new Map<string, { rate: Decimal; base: Decimal }>();
  let totalNet = new Decimal(0);

  const computed = lines.map((line) => {
    const rate = new Decimal(line.vatRate);
    const net = money(
      new Decimal(line.quantity)
        .times(line.unitPrice)
        .times(new Decimal(100).minus(line.discountPercent).div(100)),
    );
    const vat = money(net.times(rate).div(100));
    totalNet = totalNet.plus(net);
    const key = rate.toString();
    const entry = bases.get(key) ?? { rate, base: new Decimal(0) };
    entry.base = entry.base.plus(net);
    bases.set(key, entry);
    return { ...line, net: net.toFixed(2), vat: vat.toFixed(2), gross: net.plus(vat).toFixed(2) };
  });

  const breakdown = [...bases.values()]
    .sort((a, b) => b.rate.comparedTo(a.rate))
    .map(({ rate, base }) => ({
      rate: rate.toString(),
      base: base.toFixed(2),
      vat: money(base.times(rate).div(100)).toFixed(2),
    }));

  const totalVat = breakdown.reduce((sum, b) => sum.plus(b.vat), new Decimal(0));
  const totalGross = totalNet.plus(totalVat);
  const stampDuty =
    opts.paymentMethod === "CASH"
      ? money(totalGross.times(opts.rules.stampDutyRate))
      : new Decimal(0);

  return {
    lines: computed,
    breakdown,
    totalNet: totalNet.toFixed(2),
    totalVat: totalVat.toFixed(2),
    totalGross: totalGross.toFixed(2),
    stampDuty: stampDuty.toFixed(2),
    amountDue: totalGross.plus(stampDuty).toFixed(2),
  };
}
