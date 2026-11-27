// Rendering for the deal list and the deal detail pages. Builds DOM nodes
// from the deals data; no network, no templates fetched from anywhere.
import { DEALS, VERDICTS, COMPARE } from './deals.js';
import { discountOf, savedOf, money, moneyShort } from './filters.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

function verdictBadge(deal) {
  const v = VERDICTS[deal.verdict];
  const b = el('span', 'badge badge-' + deal.verdict, v.label);
  b.title = v.hint;
  return b;
}

export function dealCard(deal) {
  const card = el('article', 'deal');
  const top = el('div', 'deal-top');
  top.append(verdictBadge(deal));
  top.append(el('span', 'deal-cat', deal.category + ' · ' + deal.store));
  card.append(top);
  const name = el('h3', 'deal-name');
  const a = el('a', null, deal.product);
  a.href = '#/deal/' + deal.id;
  name.append(a);
  card.append(name);
  card.append(el('p', 'deal-blurb', deal.blurb));
  const prices = el('div', 'deal-prices');
  prices.append(el('span', 'deal-sale', money(deal.sale)));
  const was = el('span', 'deal-was', money(deal.usual));
  prices.append(was);
  prices.append(el('span', 'deal-off', '−' + discountOf(deal) + '%'));
  card.append(prices);
  card.append(el('p', 'deal-save', 'You save ' + money(savedOf(deal)) + ' vs usual price'));
  const foot = el('div', 'deal-foot');
  const link = el('a', 'deal-link', 'View at ' + deal.store + ' →');
  link.href = deal.link;
  link.target = '_blank';
  link.rel = 'noopener';
  foot.append(link);
  foot.append(el('span', 'deal-checked', 'Checked 27 Nov 2026'));
  card.append(foot);
  return card;
}

export function renderList(list, host) {
  host.textContent = '';
  if (!list.length) {
    const empty = el('div', 'empty');
    empty.append(el('h2', null, 'No deals match those filters.'));
    empty.append(el('p', null, 'Loosen a filter — or try a different search word.'));
    host.append(empty);
    return;
  }
  for (const d of list) host.append(dealCard(d));
}

export function renderDetail(id, host) {
  const deal = DEALS.find((d) => d.id === id);
  host.textContent = '';
  if (!deal) {
    host.append(el('h2', null, 'Deal not found.'));
    const back = el('a', 'back', '← Back to all deals');
    back.href = '#/';
    host.append(back);
    return;
  }
  const wrap = el('div', 'detail');
  const back = el('a', 'back', '← All deals');
  back.href = '#/';
  wrap.append(back);
  const head = el('div', 'detail-head');
  head.append(verdictBadge(deal));
  head.append(el('span', 'deal-cat', deal.category + ' · ' + deal.store));
  wrap.append(head);
  wrap.append(el('h2', 'detail-name', deal.product));
  wrap.append(el('p', 'deal-blurb', deal.blurb));
  const prices = el('div', 'detail-prices');
  const big = el('div', 'detail-sale');
  big.append(el('span', 'lbl', 'Sale price'));
  big.append(el('span', 'val', money(deal.sale)));
  const usual = el('div', 'detail-usual');
  usual.append(el('span', 'lbl', 'Usual price'));
  usual.append(el('span', 'val', money(deal.usual)));
  const off = el('div', 'detail-off');
  off.append(el('span', 'lbl', 'Discount'));
  off.append(el('span', 'val', '−' + discountOf(deal) + '% · save ' + money(savedOf(deal))));
  prices.append(big, usual, off);
  wrap.append(prices);
  const verdict = el('div', 'detail-verdict');
  verdict.append(el('h3', null, 'Is it really a deal? ' + VERDICTS[deal.verdict].label));
  verdict.append(el('p', null, deal.verdictNote));
  wrap.append(verdict);
  const facts = el('dl', 'detail-facts');
  const rows = [
    ['Store', deal.store],
    ['Price checked', '27 Nov 2026'],
    ['Source', deal.source + ' (' + deal.sourceDate + ')'],
    ['Sale runs', 'Black Friday Week, 19–30 Nov 2026'],
  ];
  for (const [k, v] of rows) {
    facts.append(el('dt', null, k));
    facts.append(el('dd', null, v));
  }
  wrap.append(facts);
  const link = el('a', 'deal-link big', 'View at ' + deal.store + ' →');
  link.href = deal.link;
  link.target = '_blank';
  link.rel = 'noopener';
  wrap.append(link);
  wrap.append(el('p', 'fine', 'Prices move on Black Friday. Confirm the price on the store page before you buy.'));
  host.append(wrap);
}

export function renderCompare(host) {
  host.textContent = '';
  const h = el('h2', null, 'Same product, different stores');
  host.append(h);
  host.append(el('p', 'sub', 'Two deals we found at more than one store — the cheapest one wins.'));
  for (const c of COMPARE) {
    const box = el('div', 'compare');
    box.append(el('h3', null, c.product));
    const table = el('table', 'compare-table');
    const head = el('tr', null);
    head.append(el('th', null, 'Store'), el('th', null, 'Price'), el('th', null, 'Note'));
    table.append(head);
    for (const r of c.rows) {
      const tr = el('tr', null);
      tr.append(el('td', null, r.store), el('td', 'num', money(r.price)), el('td', null, r.note));
      table.append(tr);
    }
    box.append(table);
    host.append(box);
  }
}
