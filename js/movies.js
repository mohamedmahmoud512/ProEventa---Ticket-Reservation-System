// movies.js
// Requires movies-data.js (MOVIES)

const grid = document.getElementById('grid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');

let state = {
  query: '',
  sort: 'default',
  page: 1,
  perPage: 8,
  items: MOVIES.slice() // clone
};

// render functions
function filterAndSort() {
  let items = MOVIES.slice();

  // search filter
  const q = state.query.trim().toLowerCase();
  if (q) {
    items = items.filter(m => m.title.toLowerCase().includes(q));
  }

  // sort
  switch (state.sort) {
    case 'title-asc': items.sort((a,b)=> a.title.localeCompare(b.title)); break;
    case 'title-desc': items.sort((a,b)=> b.title.localeCompare(a.title)); break;
    case 'rating-desc': items.sort((a,b)=> b.rating - a.rating); break;
    case 'rating-asc': items.sort((a,b)=> a.rating - b.rating); break;
    case 'year-desc': items.sort((a,b)=> b.year - a.year); break;
    case 'year-asc': items.sort((a,b)=> a.year - b.year); break;
    default: /*featured/default order*/ break;
  }

  state.items = items;
}

function renderGrid() {
  grid.innerHTML = '';

  if (state.items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted)">No movies found.</div>`;
    return;
  }

  for (const m of state.items) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${m.poster}" alt="${escapeHtml(m.title)}">
      <div class="movie-title">${escapeHtml(m.title)}</div>
      <div class="movie-meta">⭐ ${m.rating} · ${m.year}</div>
    `;
    card.addEventListener('click', () => {
      // navigate to detail page, pass id
      window.location.href = `detail.html?id=${m.id}`;
    });
    grid.appendChild(card);
  }
}

function renderPagination() {
  pagination.innerHTML = '';
  const total = state.items.length;
  const pages = Math.max(1, Math.ceil(total / state.perPage));

  // prev button
  const prev = makeBtn('Prev', () => {
    if (state.page > 1) { state.page--; update(); }
  }, state.page === 1);
  pagination.appendChild(prev);

  // page numbers (show smart range)
  const maxButtons = 7;
  let start = Math.max(1, state.page - Math.floor(maxButtons/2));
  let end = Math.min(pages, start + maxButtons -1);
  if (end - start < maxButtons -1) start = Math.max(1, end - maxButtons +1);

  for (let i = start; i <= end; i++){
    const btn = makeBtn(i, ()=>{ state.page = i; update(); }, false, state.page === i);
    pagination.appendChild(btn);
  }

  // next
  const next = makeBtn('Next', () => {
    if (state.page < pages) { state.page++; update(); }
  }, state.page === pages);
  pagination.appendChild(next);
}

function makeBtn(text, onClick, disabled=false, active=false){
  const btn = document.createElement('button');
  btn.className = 'page-btn' + (active ? ' active' : '');
  btn.textContent = text;
  btn.disabled = !!disabled;
  btn.addEventListener('click', onClick);
  return btn;
}

function update() {
  filterAndSort();
  const pages = Math.max(1, Math.ceil(state.items.length / state.perPage));
  if (state.page > pages) state.page = pages;
  renderGrid();
  renderPagination();
}

/* event handlers */
searchInput.addEventListener('input', (e) => {
  state.query = e.target.value;
  update();
});

/* simple html escape */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]); }

/* init */
update();
