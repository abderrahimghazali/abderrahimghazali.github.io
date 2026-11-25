// Copied from https://github.com/abderrahimghazali/tabaa (packages/core). Fixes go there first, then here.
// Plain-type subset of packages/core/src/contracts.ts (the zod schemas are not vendored).

export type PaymentMethod = "TRANSFER" | "CHEQUE" | "BILL_OF_EXCHANGE" | "CASH" | "CARD" | "DIRECT_DEBIT";
export type InvoiceType = "INVOICE" | "CREDIT_NOTE" | "DEPOSIT";

export interface Address {
  line1: string;
  line2?: string;
  postalCode?: string;
  city: string;
  country: string;
}

export interface Company {
  name: string;
  address: Address;
  ice: string;
  ifNumber?: string;
  rcNumber?: string;
  tpNumber?: string;
  cnssNumber?: string;
  rib?: string;
}

export interface Party {
  name: string;
  ice?: string;
  ifNumber?: string;
  address: Address;
}

export interface LineInput {
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discountPercent: string;
  vatRate: string;
}

export interface ComputedLine extends LineInput {
  net: string;
  vat: string;
  gross: string;
}

export interface TaxBreakdown {
  rate: string;
  base: string;
  vat: string;
}

export interface InvoiceTotals {
  lines: ComputedLine[];
  breakdown: TaxBreakdown[];
  totalNet: string;
  totalVat: string;
  totalGross: string;
  stampDuty: string;
  amountDue: string;
}

export interface Invoice {
  type: InvoiceType;
  number: string | null;
  issueDate: string;
  dueDate: string;
  deliveryDate?: string;
  currency: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  customer: Party;
  totals: InvoiceTotals;
  amountInWords: { fr: string };
}
