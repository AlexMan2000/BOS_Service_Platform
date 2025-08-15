
// 匹配非数字项直到数字出现为止
export const priceUnitParser = (priceString: string): string | null => {
  // Regular expression to match units like $, ¥, €, ₹, etc.
  const unitMatch = priceString.match(/[^\d\s,.-]+/);

  // Return the matched unit or null if no unit is found
  return unitMatch ? unitMatch[0] : null;
}


export const priceParser = (priceString: string): number[] => {
  if (!priceString) {
    return [];
  }


  const matchRes = priceString.match(/\d+,(\d{3},)*\d{3}/g);
  if (!matchRes || matchRes.length == 0) {
    return [];
  }

  const prices = matchRes.map(price => price.replace(/,/g, ''));
  return prices.map((price:string) => parseFloat(price));
}



export const priceFormatter = (price: number, decimal: number) => {

    if (price >= 1e12) {
        return (price / 1e12).toFixed(decimal) + 'T';
      } else if (price >= 1e9) {
        return (price / 1e9).toFixed(decimal) + 'B';
      } else if (price >= 1e6) {
        return (price / 1e6).toFixed(decimal) + 'M';
      } else if (price >= 1e3) {
        return (price / 1e3).toFixed(decimal) + 'K';
      } else {
        return price.toString();
      }
}