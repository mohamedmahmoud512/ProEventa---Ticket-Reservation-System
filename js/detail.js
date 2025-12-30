// detail.js
// Requires movies-data.js

function getQueryParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

const id = parseInt(getQueryParam('id'), 10);
const detailWrap = document.getElementById('detail');

if (!id) {
  detailWrap.innerHTML = `<div style="color:var(--muted)">No movie id. <a href="Home.html">Back to list</a></div>`;
} else {
  const m = MOVIES.find(x => x.id === id);
if (!m) {
    detailWrap.innerHTML = `<div style="color:var(--muted)">Movie not found. <a href="Home.html">Back to list</a></div>`;
  } else {
    detailWrap.innerHTML = `
      <div class="poster-large">
        <img src="${m.poster}" alt="${escapeHtml(m.title)}">
      </div>
      <div class="detail-info dark-bg">
        <h1 class="detail-title">${escapeHtml(m.title)}</h1>
        <div class="detail-meta">⭐ IMDb: ${m.rating}<br>${m.votes.toLocaleString()} voters</div>
        <p class="description">${escapeHtml(m.description)}</p>
        <h3>Cast:</h3>
        <ul class="cast-list">
          ${m.cast.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
        <div class="buttons">
          <button class="btn watch-trailer">▶ Watch Trailer</button>
          <button class="btn">🎟 Tickets</button>
        </div>
      </div>
    `;

    // Add event listener to Watch Trailer button
    const watchTrailerBtn = detailWrap.querySelector('.watch-trailer');
    watchTrailerBtn.addEventListener('click', () => {
      showMovieDetailsWithShowtimes(m);
    });

    // Add event listener to Tickets button
    const ticketsBtn = detailWrap.querySelector('.btn:not(.watch-trailer)');
    ticketsBtn.addEventListener('click', () => {
      window.location.href = `booking.html?type=movie&id=${m.id}`;
    });
  }
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'<','>':'>','"':'"',"'":'&#39;' })[m]); }

function showMovieDetailsWithShowtimes(m) {
  const detailInfo = document.querySelector('.detail-info');
  const originalContent = detailInfo.innerHTML;
  detailInfo.innerHTML = `
    <div class="showtimes-info">
      <h2>Showtimes</h2>
      <p><strong>Language:</strong> ${escapeHtml(m.language || 'English')}</p>
      <p><strong>Cinema:</strong> ${escapeHtml(m.cinema || 'AMC Theatres')}</p>
    </div>
    <div class="showtimes-buttons">
      ${m.showtimes ? m.showtimes.map(st => `<button class="showtime-btn">${st.date} - ${st.time}</button>`).join('') : '<p>No showtimes available</p>'}
    </div>
    <button class="btn back-to-details" style="margin-top:20px;">Back to Details</button>
  `;

  // Add event listener to back button
  const backBtn = detailInfo.querySelector('.back-to-details');
  backBtn.addEventListener('click', () => {
    detailInfo.innerHTML = originalContent;
    // Re-attach event listeners
    const watchTrailerBtn = detailInfo.querySelector('.watch-trailer');
    if (watchTrailerBtn) {
      watchTrailerBtn.addEventListener('click', () => {
        showMovieDetailsWithShowtimes(m);
      });
    }
    const ticketsBtn = detailInfo.querySelector('.btn:not(.watch-trailer)');
    if (ticketsBtn) {
      ticketsBtn.addEventListener('click', () => {
        window.location.href = `booking.html?type=movie&id=${m.id}`;
      });
    }
  });
}
