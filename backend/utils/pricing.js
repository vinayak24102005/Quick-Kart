const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 49;

const calcShipping = (itemsTotal) =>
  itemsTotal === 0 || itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

module.exports = { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, calcShipping };
