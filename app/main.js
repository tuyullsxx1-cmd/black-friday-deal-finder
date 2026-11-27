// Boot and routing for the deal finder. Reads the hash route, wires the
// search and filter controls, and renders the list, a detail page, or the
// store comparison. All state lives in this module; nothing is fetched.
import { DEALS, CATEGORIES, STORES, CHECKED_ON, CHECKED_NOTE } from './deals.js';
import { applyFilters, applySort, totals, moneyShort } from './filters.js';
import { renderList, renderDetail, renderCompare } from './render.js';

const state = { q: '', category: 'All', store: 'All', minOff: 0, verdict: 'All', sort: 'discount' };

const listHost = document.getElementById('deals');
const countHost = document.getElementById('count');
const listView = document.getElementById('list-view');
const detailView = document.getElementById('detail-view');
const compareView = document.getElementById('compare-view');

function fillStats() {
  const t = totals(DEALS);
  document.getElementById('stat-deals').textContent = String(t.count);
  document.getElementById('stat-saved').textContent = moneyShort(t.saved);
  document.getElementById('stat-newlow').textContent = String(t.newlow);
  document.getElementById('checked-on').textContent = 'All prices checked ' + CHECKED_ON + '. ' + CHECKED_NOTE;
}

function fillOptions(select, values) {
  for (const v of values) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = v === 'All' ? 'All' : v;
    select.append(o);
  }
}

function show(view) {
  for (const v of [listView, detailView, compareView]) v.hidden = true;
  view.hidden = false;
}

function render() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/deal/')) {
    show(detailView);
    renderDetail(hash.slice(7), detailView);
    window.scrollTo(0, 0);
    return;
  }
  if (hash === '#/compare') {
    show(compareView);
    renderCompare(compareView);
    window.scrollTo(0, 0);
    return;
  }
  show(listView);
  const filtered = applySort(applyFilters(DEALS, state), state.sort);
  renderList(filtered, listHost);
  countHost.textContent = filtered.length + ' of ' + DEALS.length + ' deals';
}

function wire() {
  fillOptions(document.getElementById('f-category'), CATEGORIES);
  fillOptions(document.getElementById('f-store'), STORES);
  document.getElementById('f-search').addEventListener('input', (e) => {
    state.q = e.target.value;
    render();
  });
  document.getElementById('f-category').addEventListener('change', (e) => {
    state.category = e.target.value;
    render();
  });
  document.getElementById('f-store').addEventListener('change', (e) => {
    state.store = e.target.value;
    render();
  });
  document.getElementById('f-minoff').addEventListener('change', (e) => {
    state.minOff = Number(e.target.value);
    render();
  });
  document.getElementById('f-verdict').addEventListener('change', (e) => {
    state.verdict = e.target.value;
    render();
  });
  document.getElementById('f-sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });
  document.getElementById('nav-compare').addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = '#/compare';
  });
  window.addEventListener('hashchange', render);
}

fillStats();
wire();
render();
