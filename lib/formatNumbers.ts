export function formatPercentage(value: number, locale: string = 'ar-SA') {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatCurrency(value: number, locale: string = 'ar-SA') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string, locale: string = 'ar-SA') {
  return new Date(value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const arabicNumbers = [
  /٠/g,
  /١/g,
  /٢/g,
  /٣/g,
  /٤/g,
  /٥/g,
  /٦/g,
  /٧/g,
  /٨/g,
  /٩/g,
];
export const fixNumbers = (input: string) => {
  if (typeof input === 'string') {
    for (let i = 0; i < 10; i++) {
      input = input.replace(arabicNumbers[i], i.toString());
    }
  }
  return input;
};
