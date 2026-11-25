import { computeInvoice } from './tabaa-core/calculator';
import { MA_2026 } from './tabaa-core/rules';
import { buildUbl } from './tabaa-core/ubl';
import { amountInWords } from './tabaa-core/words';
import type { InvoiceTotals, LineInput, PaymentMethod } from './tabaa-core/types';

export interface FormLine {
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discountPercent: string;
  vatRate: string;
}

export interface InvoiceForm {
  seller: { name: string; ice: string; ifNumber: string; rc: string; tp: string; cnss: string; address: string; city: string };
  buyer: { name: string; ice: string; address: string; city: string };
  number: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  paymentMethod: PaymentMethod;
  lines: FormLine[];
  notes: string;
}

export interface Built {
  xml: string;
  totals: InvoiceTotals;
  words: string;
}

const num = /^\d{1,13}(\.\d{1,6})?$/;
const opt = (s: string) => (s.trim() ? s.trim() : undefined);
const dec = (s: string, fallback = '0') => {
  const t = s.trim().replace(',', '.');
  return num.test(t) ? t : fallback;
};

/** Builds the UBL document from the form. Empty or invalid numbers count as zero, so the preview never throws. */
export function build(f: InvoiceForm): Built {
  const lines: LineInput[] = f.lines.map((l) => ({
    description: l.description.trim() || '—',
    quantity: dec(l.quantity),
    unit: l.unit.trim() || 'unité',
    unitPrice: dec(l.unitPrice),
    discountPercent: dec(l.discountPercent),
    vatRate: dec(l.vatRate, '20'),
  }));
  const totals = computeInvoice(lines, { paymentMethod: f.paymentMethod, rules: MA_2026 });
  const words = amountInWords(totals.amountDue);
  const xml = buildUbl({
    company: {
      name: f.seller.name.trim(),
      ice: f.seller.ice.replace(/\s+/g, ''),
      ifNumber: opt(f.seller.ifNumber),
      rcNumber: opt(f.seller.rc),
      tpNumber: opt(f.seller.tp),
      cnssNumber: opt(f.seller.cnss),
      address: { line1: f.seller.address.trim(), city: f.seller.city.trim(), country: 'MA' },
    },
    invoice: {
      type: 'INVOICE',
      number: f.number.trim(),
      issueDate: f.issueDate,
      dueDate: f.dueDate || f.issueDate,
      currency: (f.currency.trim() || 'MAD').toUpperCase(),
      paymentMethod: f.paymentMethod,
      notes: opt(f.notes),
      customer: {
        name: f.buyer.name.trim(),
        ice: opt(f.buyer.ice.replace(/\s+/g, '')),
        address: { line1: f.buyer.address.trim(), city: f.buyer.city.trim(), country: 'MA' },
      },
      totals,
      amountInWords: { fr: words },
    },
  });
  return { xml, totals, words };
}
