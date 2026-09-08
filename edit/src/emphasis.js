/* Which caption words get the yellow, larger treatment. Numbers, money and percentages
   always do. Beyond that, a short list per series — keep it short or nothing stands out. */
const LISTS = {
  B: ['effective', 'statement', 'fees', 'fee', 'flat', 'tiered', 'exit', 'term', 'rental', 'average', 'debit', 'credit', 'amex', 'own', 'renting'],
  A: ['introduce', 'introduction', 'customer', 'customers', 'partner', 'count', 'names', 'stay', 'refund'],
  C: ['statement', 'rate', 'fees', 'offline', '4g', 'till', 'z-report', 'commission', 'direct', 'term', 'exit', 'months', 'pounds', 'own', 'renting', 'boring', 'sum', 'drawer', 'queue', 'receipt']
};
export function isEmphasis(word, series) {
  const w = String(word).replace(/^[“"'(]+|[”"')\.,!?;:]+$/g, '');
  if (/\d/.test(w) || /[£%]/.test(w) || /^\d+p$/i.test(w)) return true;
  return (LISTS[series] || []).indexOf(w.toLowerCase()) > -1;
}
export function spokenNumber(word) { return /\d|£|%/.test(word); }
