// bookings.js - My Bookings page
function getQueryParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

const bookingsContent = document.getElementById('bookings-content');
const currentUser = getCurrentUser();

if (!currentUser) {
  bookingsContent.innerHTML = '<div style="color:var(--muted)">Please <a href="login.html">login</a> to view your bookings.</div>';
} else {
  const bookings = getBookings();
  const userBookings = bookings.filter(b => b.userId === currentUser.id || b.email === currentUser.email);

  if (userBookings.length === 0) {
    bookingsContent.innerHTML = '<div style="color:var(--muted)">You have no bookings yet.</div>';
  } else {
    bookingsContent.innerHTML = `
      <div class="bookings-list">
        ${userBookings.map(b => {
          const item = b.type === 'movie' ? MOVIES.find(m => m.id === parseInt(b.itemId)) : getEvents().find(e => e.id === parseInt(b.itemId));
          const itemName = item ? item.title || item.name : 'Unknown';
          const statusColor = b.status === 'confirmed' ? 'green' : b.status === 'pending' ? 'orange' : 'red';
          return `
            <div class="booking-card dark-bg">
              <h3>${escapeHtml(itemName)}</h3>
              <p><strong>Booking ID:</strong> ${b.id}</p>
              <p><strong>Seats:</strong> ${b.seats.join(', ')}</p>
              <p><strong>Total:</strong> $${b.seats.length * 10}</p>
              <p><strong>Status:</strong> <span style="color:${statusColor}">${b.status}</span></p>
              <p><strong>Date:</strong> ${new Date(b.id).toLocaleDateString()}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// Helper functions available from data.js: getBookings, getCurrentUser, escapeHtml
