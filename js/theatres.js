// theatres.js
// Requires data.js

const theatresGrid = document.getElementById('theatres-grid');
const searchInput = document.getElementById('searchInput');

let theatresState = {
  query: '',
  theatres: getTheatres().slice() // clone
};

// render functions
function filterTheatres() {
  let items = getTheatres().slice();

  // search filter
  const q = theatresState.query.trim().toLowerCase();
  if (q) {
    items = items.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q));
  }

  theatresState.theatres = items;
}

function renderTheatres() {
  theatresGrid.innerHTML = '';

  if (theatresState.theatres.length === 0) {
    theatresGrid.innerHTML = `<div style="grid-column:1/-1;color:var(--muted)">No theatres found.</div>`;
    return;
  }

  for (const t of theatresState.theatres) {
    const card = document.createElement('div');
    card.className = 'theatre-card';
    card.innerHTML = `
      <div class="theatre-name">${escapeHtml(t.name)}</div>
      <div class="theatre-meta">${escapeHtml(t.location)}</div>
      <div class="theatre-address">${escapeHtml(t.address)}</div>
    `;
    // Add click event for future booking integration
    card.addEventListener('click', () => {
      // For now, just alert
      alert(`Selected theatre: ${t.name}`);
    });
    theatresGrid.appendChild(card);
  }


}

/* event handlers */
searchInput.addEventListener('input', (e) => {
  theatresState.query = e.target.value;
  filterTheatres();
  renderTheatres();
});

/* simple html escape */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'<','>':'>','"':'"',"'":'&#39;' })[m]); }





/* init */
filterTheatres();
renderTheatres();
