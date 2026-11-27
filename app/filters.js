// Filtering and sorting for the deal list. Pure functions over the deals
// array, so the list, the counts and the detail pages all agree.
export function discountOf(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function savedOf(deal) {
  return Math.round((deal.usual - deal.sale) * 100) / 100;
}

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function applyFilters(deals, state) {
  const q = state.q.trim().toLowerCase();
  return deals.filter((d) => {
    if (state.category !== 'All' && d.category !== state.category) return false;
    if (state.store !== 'All' && d.store !== state.store) return false;
    if (state.minOff !== 0 && discountOf(d) < state.minOff) return false;
    if (state.verdict !== 'All' && d.verdict !== state.verdict) return false;
    if (q) {
      const hay = (d.product + ' ' + d.brand + ' ' + d.store + ' ' + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function applySort(list, sort) {
  const out = list.slice();
  if (sort === 'discount') out.sort((a, b) => discountOf(b) - discountOf(a) || savedOf(b) - savedOf(a));
  else if (sort === 'saved') out.sort((a, b) => savedOf(b) - savedOf(a));
  else if (sort === 'price') out.sort((a, b) => a.sale - b.sale);
  else if (sort === 'newlow') {
    const rank = { newlow: 0, strong: 1, solid: 2, routine: 3 };
    out.sort((a, b) => rank[a.verdict] - rank[b.verdict] || discountOf(b) - discountOf(a));
  }
  return out;
}

export function totals(deals) {
  let saved = 0;
  let newlow = 0;
  for (const d of deals) {
    saved += d.usual - d.sale;
    if (d.verdict === 'newlow') newlow += 1;
  }
  return { count: deals.length, saved: Math.round(saved), newlow };
}
