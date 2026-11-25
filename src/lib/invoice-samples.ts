import type { InvoiceForm } from './invoice-form';

// All names are fictional. The ICE values pass the control-key check but belong to no company we know of.
export const sample: InvoiceForm = {
  seller: { name: 'Atelier Exemple SARL', ice: '999999999000079', ifNumber: '12345678', rc: '98765', tp: '11223344', cnss: '7654321', address: '12 avenue Exemple', city: 'Rabat' },
  buyer: { name: 'Société Modèle SA', ice: '888888888000081', address: '45 boulevard Modèle', city: 'Casablanca' },
  number: 'FA-2026-00001',
  issueDate: '2026-11-25',
  dueDate: '2026-12-25',
  currency: 'MAD',
  paymentMethod: 'TRANSFER',
  lines: [
    { description: 'Conception du catalogue', quantity: '1', unit: 'unité', unitPrice: '4500.00', discountPercent: '0', vatRate: '20' },
    { description: 'Impression, 500 exemplaires', quantity: '500', unit: 'unité', unitPrice: '12.50', discountPercent: '0', vatRate: '20' },
  ],
  notes: 'Exemple fictif.',
};

export const mixed: InvoiceForm = {
  ...sample,
  lines: [
    { description: 'Prestation à 20 %', quantity: '3', unit: 'jour', unitPrice: '1250.00', discountPercent: '10', vatRate: '20' },
    { description: 'Fournitures à 10 %', quantity: '12.5', unit: 'kg', unitPrice: '84.30', discountPercent: '5', vatRate: '10' },
    { description: 'Article exonéré', quantity: '4', unit: 'unité', unitPrice: '19.99', discountPercent: '0', vatRate: '0' },
  ],
};

export const zeroRate: InvoiceForm = {
  ...sample,
  lines: [{ description: 'Service exonéré', quantity: '2', unit: 'unité', unitPrice: '300.00', discountPercent: '0', vatRate: '0' }],
};

export const minimal: InvoiceForm = {
  seller: { name: 'Vendeur', ice: '999999999000079', ifNumber: '', rc: '', tp: '', cnss: '', address: '1 rue A', city: 'Rabat' },
  buyer: { name: 'Client', ice: '', address: '2 rue B', city: 'Fès' },
  number: 'F-1',
  issueDate: '2026-11-25',
  dueDate: '2026-11-25',
  currency: 'MAD',
  paymentMethod: 'TRANSFER',
  lines: [{ description: 'Article', quantity: '1', unit: 'unité', unitPrice: '100', discountPercent: '0', vatRate: '20' }],
  notes: '',
};

export const cash: InvoiceForm = { ...sample, paymentMethod: 'CASH' };

export const specialChars: InvoiceForm = {
  ...sample,
  seller: { ...sample.seller, name: 'Dupont & Fils <SARL> "Les Oliviers"' },
  lines: [
    { description: "Étude d'impact & rapport <final> « 2026 » — شكرا", quantity: '0.5', unit: 'h', unitPrice: '999999.99', discountPercent: '33.33', vatRate: '20' },
    ...Array.from({ length: 30 }, (_, i) => ({ description: `Ligne ${i + 2}`, quantity: String(i + 1), unit: 'unité', unitPrice: '0.01', discountPercent: '0', vatRate: i % 3 === 0 ? '10' : '20' })),
  ],
};

export const samples = { sample, mixed, zeroRate, minimal, cash, specialChars };
