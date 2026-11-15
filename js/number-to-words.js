/**
 * Converts numeric amounts to words in Indian English currency convention
 * e.g., 40000 -> "Rupees Forty Thousand Only"
 * 125450.50 -> "Rupees One Lakh Twenty Five Thousand Four Hundred Fifty and Fifty Paise Only"
 */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertBelowThousand(n) {
  let word = "";
  if (n >= 100) {
    word += ONES[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n >= 20) {
    word += TENS[Math.floor(n / 10)] + " ";
    n %= 10;
  }
  if (n > 0) {
    word += ONES[n] + " ";
  }
  return word.trim();
}

/**
 * Convert number to words using Indian Numbering system (Crores, Lakhs, Thousands, Hundreds)
 * @param {number} amount 
 * @param {string} currencyPrefix - e.g. "Rupees"
 * @param {string} coinName - e.g. "Paise"
 * @returns {string}
 */
export function numberToIndianWords(amount, currencyPrefix = "Rupees", coinName = "Paise") {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "";
  }

  const num = Math.abs(Number(amount));
  if (num === 0) {
    return `${currencyPrefix} Zero Only`;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let remaining = integerPart;
  let parts = [];

  // Crores (1,00,00,000)
  if (remaining >= 10000000) {
    const crore = Math.floor(remaining / 10000000);
    remaining %= 10000000;
    parts.push(numberToIndianWords(crore, "", "").replace("Only", "").trim() + " Crore");
  }

  // Lakhs (1,00,000)
  if (remaining >= 100000) {
    const lakh = Math.floor(remaining / 100000);
    remaining %= 100000;
    parts.push(convertBelowThousand(lakh) + " Lakh");
  }

  // Thousands (1,000)
  if (remaining >= 1000) {
    const thousand = Math.floor(remaining / 1000);
    remaining %= 1000;
    parts.push(convertBelowThousand(thousand) + " Thousand");
  }

  // Hundreds & units
  if (remaining > 0) {
    parts.push(convertBelowThousand(remaining));
  }

  let result = parts.join(" ").trim();
  if (currencyPrefix) {
    result = `${currencyPrefix} ${result}`;
  }

  if (decimalPart > 0) {
    const decimalWords = convertBelowThousand(decimalPart);
    result += ` and ${decimalWords} ${coinName}`;
  }

  return `${result} Only`;
}

/**
 * Format number into Indian comma separated string (e.g. 40,000.00 or 1,25,000.50)
 * @param {number} num 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatIndianCurrency(num, decimals = 2) {
  if (isNaN(num) || num === null || num === undefined) return "0.00";
  const fixed = Number(num).toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");

  // Indian formatting: last 3 digits, then groups of 2
  let lastThree = intPart.slice(-3);
  let otherNumbers = intPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}
