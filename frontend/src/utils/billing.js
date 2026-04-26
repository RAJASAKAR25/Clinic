export const BILL_TREATMENT_OPTIONS = [
  'Consultation',
  'Root Canal Treatment',
  'Scaling',
  'Filling',
  'Extraction',
  'Impaction Surgery',
  'Crown',
  'FPD',
  'Implants',
  'Complete Denture',
  'Partial Denture',
  'Teeth Whitening',
  'Braces',
  'Aligners',
  'X-Ray/RVG',
  'Other',
];

export const DEFAULT_TREATMENT_PRICES = {
  Consultation: 300,
  'Root Canal Treatment': 3500,
  Scaling: 1200,
  Filling: 1000,
  Extraction: 800,
  'Impaction Surgery': 5000,
  Crown: 4500,
  FPD: 9000,
  Implants: 25000,
  'Complete Denture': 12000,
  'Partial Denture': 7000,
  'Teeth Whitening': 5000,
  Braces: 18000,
  Aligners: 55000,
  'X-Ray/RVG': 600,
};

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
  'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const twoDigitsToWords = (value) => {
  if (value < 20) {
    return ONES[value];
  }
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return `${TENS[tens]}${ones ? ` ${ONES[ones]}` : ''}`.trim();
};

const threeDigitsToWords = (value) => {
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;

  if (!hundreds) {
    return twoDigitsToWords(remainder);
  }

  const suffix = remainder ? ` ${twoDigitsToWords(remainder)}` : '';
  return `${ONES[hundreds]} Hundred${suffix}`.trim();
};

export const amountToWordsINR = (amount) => {
  const value = Math.floor(Number(amount) || 0);
  if (value === 0) {
    return 'Rupees Zero Only';
  }

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const remainder = value % 1000;

  const parts = [];
  if (crore) {
    parts.push(`${twoDigitsToWords(crore)} Crore`);
  }
  if (lakh) {
    parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  }
  if (thousand) {
    parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  }
  if (remainder) {
    parts.push(threeDigitsToWords(remainder));
  }

  return `Rupees ${parts.join(' ').trim()} Only`;
};

export const formatINRCurrency = (value) =>
  `₹ ${new Intl.NumberFormat('en-IN').format(Number(value) || 0)}`;

export const parsePriceString = (rawPrice) => {
  if (!rawPrice) {
    return null;
  }
  const numeric = String(rawPrice).replace(/[^\d]/g, '');
  if (!numeric) {
    return null;
  }
  return Number(numeric);
};
