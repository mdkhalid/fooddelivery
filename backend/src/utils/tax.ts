/**
 * Tax calculation utilities supporting multiple jurisdictions.
 * In production, this should integrate with a tax API (e.g., TaxJar, Stripe Tax).
 */

interface TaxJurisdiction {
  name: string;
  rate: number;
  type: 'vat' | 'gst' | 'sales_tax';
}

interface TaxLineItem {
  name: string;
  amount: number;
  category: 'food' | 'beverage' | 'alcohol' | 'other';
  rate: number;
  taxAmount: number;
}

const JURISDICTIONS: Record<string, TaxJurisdiction> = {
  'US:default': { name: 'US Sales Tax', rate: 0.08, type: 'sales_tax' },
  'US:CA': { name: 'California Sales Tax', rate: 0.0875, type: 'sales_tax' },
  'US:NY': { name: 'New York Sales Tax', rate: 0.08875, type: 'sales_tax' },
  'US:TX': { name: 'Texas Sales Tax', rate: 0.0825, type: 'sales_tax' },
  'UK:default': { name: 'UK VAT', rate: 0.20, type: 'vat' },
  'AE:default': { name: 'UAE VAT', rate: 0.05, type: 'vat' },
  'SA:default': { name: 'Saudi VAT', rate: 0.15, type: 'vat' },
  'EG:default': { name: 'Egypt VAT', rate: 0.14, type: 'vat' },
};

function getJurisdictionKey(country: string, state?: string): string {
  if (country === 'US' && state) return `US:${state}`;
  return `${country}:default`;
}

export function getTaxRate(country: string, state?: string): number {
  const key = getJurisdictionKey(country, state);
  return JURISDICTIONS[key]?.rate || JURISDICTIONS['US:default'].rate;
}

export function getTaxType(country: string, state?: string): string {
  const key = getJurisdictionKey(country, state);
  return JURISDICTIONS[key]?.type || 'sales_tax';
}

export function calculateTax(
  subtotal: number,
  country: string,
  state?: string,
  items?: { name: string; amount: number; category: 'food' | 'beverage' | 'alcohol' | 'other' }[]
): { totalTax: number; rate: number; breakdown: TaxLineItem[]; jurisdiction: string } {
  const rate = getTaxRate(country, state);
  const jurisdiction = getJurisdictionKey(country, state);

  if (items) {
    // Per-item calculation — alcohol and prepared food may have different rates
    const breakdown = items.map((item) => {
      let effectiveRate = rate;
      // Alcohol often has higher tax
      if (item.category === 'alcohol') effectiveRate = Math.max(effectiveRate, 0.15);
      return {
        name: item.name,
        amount: item.amount,
        category: item.category,
        rate: effectiveRate,
        taxAmount: parseFloat((item.amount * effectiveRate).toFixed(2)),
      };
    });
    const totalTax = parseFloat(breakdown.reduce((s, i) => s + i.taxAmount, 0).toFixed(2));
    return { totalTax, rate, breakdown, jurisdiction };
  }

  // Simple calculation on subtotal
  const totalTax = parseFloat((subtotal * rate).toFixed(2));
  return {
    totalTax,
    rate,
    breakdown: [{ name: 'Subtotal', amount: subtotal, category: 'other', rate, taxAmount: totalTax }],
    jurisdiction,
  };
}

export function getTaxExemptAmount(amount: number, exemptionCertificate: string): { taxable: number; exempt: number; certificate: string } {
  // For tax-exempt orders (non-profit, diplomatic)
  return { taxable: 0, exempt: amount, certificate: exemptionCertificate };
}

export function formatTaxDisplay(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
