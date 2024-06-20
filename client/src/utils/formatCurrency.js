export const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
};
