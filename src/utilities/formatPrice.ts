export const formatPrice = (value: number): string =>
  Math.round(value).toLocaleString('en-US').replace(/,/g, ' ')
