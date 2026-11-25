// Copied from https://github.com/abderrahimghazali/tabaa (packages/core). Fixes go there first, then here.
// Trimmed to the invoice branch of buildUbl; see the commit message for the changes made to pass the OASIS UBL 2.1 XSD.
import type { Company, Invoice, Party } from "./types";

const NS = {
  Invoice: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
  CreditNote: "urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2",
};

// UNCL 4461 payment means codes.
const PAYMENT_CODE: Record<Invoice["paymentMethod"], string> = {
  TRANSFER: "30",
  CHEQUE: "20",
  BILL_OF_EXCHANGE: "24",
  CASH: "10",
  CARD: "48",
  DIRECT_DEBIT: "49",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

type Attrs = Record<string, string>;

function el(name: string, content: string | string[], attrs: Attrs = {}): string {
  const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
  if (Array.isArray(content)) return `<${name}${a}>${content.join("")}</${name}>`;
  return `<${name}${a}>${esc(content)}</${name}>`;
}

const cbc = (name: string, value: string, attrs?: Attrs) => el(`cbc:${name}`, value, attrs);
const cac = (name: string, children: string[]) => el(`cac:${name}`, children);

// The "MA:*" scheme ids are placeholders pending the official Moroccan UBL profile.
function party(
  wrapper: string,
  p: {
    name: string;
    address: Company["address"];
    ice?: string;
    ifNumber?: string;
    ids: [string, string | undefined][];
  },
): string {
  const ids = [["MA:ICE", p.ice] as [string, string | undefined], ...p.ids].filter(([, v]) => v);
  const address = [
    cbc("StreetName", p.address.line1),
    ...(p.address.line2 ? [cbc("AdditionalStreetName", p.address.line2)] : []),
    cbc("CityName", p.address.city),
    ...(p.address.postalCode ? [cbc("PostalZone", p.address.postalCode)] : []),
    cac("Country", [cbc("IdentificationCode", p.address.country)]),
  ];
  const legal = [cbc("RegistrationName", p.name), ...(p.ice ? [cbc("CompanyID", p.ice)] : [])];
  return cac(wrapper, [
    cac("Party", [
      ...ids.map(([scheme, v]) => cac("PartyIdentification", [cbc("ID", v!, { schemeID: scheme })])),
      cac("PartyName", [cbc("Name", p.name)]),
      cac("PostalAddress", address),
      ...(p.ifNumber
        ? [cac("PartyTaxScheme", [cbc("CompanyID", p.ifNumber), cac("TaxScheme", [cbc("ID", "VAT")])])]
        : []),
      cac("PartyLegalEntity", legal),
    ]),
  ]);
}

function customerParty(c: Party) {
  return party("AccountingCustomerParty", {
    name: c.name,
    address: c.address,
    ice: c.ice,
    ifNumber: c.ifNumber,
    ids: [["MA:IF", c.ifNumber]],
  });
}

export function buildUbl(input: { company: Company; invoice: Invoice; originalNumber?: string }): string {
  const { company, invoice, originalNumber } = input;
  const credit = invoice.type === "CREDIT_NOTE";
  const root = credit ? "CreditNote" : "Invoice";
  const cur = { currencyID: invoice.currency };
  const amount = (name: string, v: string) => cbc(name, v, cur);
  const t = invoice.totals;

  const notes = [invoice.notes, invoice.amountInWords.fr].filter((n): n is string => !!n);

  const taxCategory = (rate: string) =>
    cac("TaxCategory", [
      cbc("ID", Number(rate) > 0 ? "S" : "E"),
      cbc("Percent", rate),
      cac("TaxScheme", [cbc("ID", "VAT")]),
    ]);

  const lineTag = credit ? "CreditNoteLine" : "InvoiceLine";
  const qtyTag = credit ? "CreditedQuantity" : "InvoicedQuantity";

  const body = [
    cbc("UBLVersionID", "2.1"),
    cbc("ID", invoice.number ?? ""),
    cbc("IssueDate", invoice.issueDate),
    ...(credit ? [] : [cbc("DueDate", invoice.dueDate)]),
    credit
      ? cbc("CreditNoteTypeCode", "381")
      : cbc("InvoiceTypeCode", invoice.type === "DEPOSIT" ? "386" : "380"),
    ...notes.map((n) => cbc("Note", n)),
    cbc("DocumentCurrencyCode", invoice.currency),
    ...(credit && originalNumber
      ? [cac("BillingReference", [cac("InvoiceDocumentReference", [cbc("ID", originalNumber)])])]
      : []),
    party("AccountingSupplierParty", {
      name: company.name,
      address: company.address,
      ice: company.ice,
      ifNumber: company.ifNumber,
      ids: [
        ["MA:IF", company.ifNumber],
        ["MA:RC", company.rcNumber],
        ["MA:TP", company.tpNumber],
        ["MA:CNSS", company.cnssNumber],
      ],
    }),
    customerParty(invoice.customer),
    ...(invoice.deliveryDate ? [cac("Delivery", [cbc("ActualDeliveryDate", invoice.deliveryDate)])] : []),
    cac("PaymentMeans", [
      cbc("PaymentMeansCode", PAYMENT_CODE[invoice.paymentMethod]),
      ...(company.rib ? [cac("PayeeFinancialAccount", [cbc("ID", company.rib)])] : []),
    ]),
    cac("TaxTotal", [
      amount("TaxAmount", t.totalVat),
      ...t.breakdown.map((b) =>
        cac("TaxSubtotal", [
          amount("TaxableAmount", b.base),
          amount("TaxAmount", b.vat),
          taxCategory(b.rate),
        ]),
      ),
    ]),
    cac("LegalMonetaryTotal", [
      amount("LineExtensionAmount", t.totalNet),
      amount("TaxExclusiveAmount", t.totalNet),
      amount("TaxInclusiveAmount", t.totalGross),
      ...(Number(t.stampDuty) !== 0 ? [amount("ChargeTotalAmount", t.stampDuty)] : []),
      amount("PayableAmount", t.amountDue),
    ]),
    ...t.lines.map((l, i) =>
      cac(lineTag, [
        cbc("ID", String(i + 1)),
        cbc(qtyTag, l.quantity, { unitCode: "C62" }),
        amount("LineExtensionAmount", l.net),
        cac("Item", [
          cbc("Name", l.description),
          cac("ClassifiedTaxCategory", [
            cbc("ID", Number(l.vatRate) > 0 ? "S" : "E"),
            cbc("Percent", l.vatRate),
            cac("TaxScheme", [cbc("ID", "VAT")]),
          ]),
        ]),
        cac("Price", [amount("PriceAmount", l.unitPrice)]),
      ]),
    ),
  ];

  const open = `<${root} xmlns="${NS[root]}" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n${open}${body.join("")}</${root}>`;
}
