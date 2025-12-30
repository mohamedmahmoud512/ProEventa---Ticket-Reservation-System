// profile.js
// Requires data.js, auth.js

document.addEventListener('DOMContentLoaded', function() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  renderProfile(currentUser);
});

function renderProfile(user) {
  const profileContent = document.getElementById('profile-content');
  const bookings = getBookings().filter(b => b.userId === user.id);

  profileContent.innerHTML = `
    <div class="profile-section">
      <h2>User Details</h2>
      <form id="profileForm">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" value="${escapeHtml(user.firstName)}" required>
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" value="${escapeHtml(user.lastName)}" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" value="${escapeHtml(user.email)}" required>
        </div>
        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" value="${escapeHtml(user.address)}" required>
        </div>
        <button type="submit" class="btn">Update Profile</button>
      </form>
    </div>
    <div class="profile-section">
      <h2>Booking History</h2>
      ${bookings.length === 0 ? '<p>No bookings yet.</p>' : `
        <ul class="booking-list">
          ${bookings.map(b => `
            <li>
              <strong>${b.type === 'movie' ? 'Movie' : 'Event'}:</strong> ${getItemTitle(b)}<br>
              <strong>Showtime:</strong> ${b.showtime}<br>
              <strong>Seats:</strong> ${b.seats.join(', ')}<br>
              <strong>Status:</strong> ${b.status}
            </li>
          `).join('')}
        </ul>
      `}
    </div>
  `;

  // Handle form submission
  document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const updatedUser = {
      ...user,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value
    };
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    users[index] = updatedUser;
    setUsers(users);
    setCurrentUser(updatedUser);
    alert('Profile updated successfully!');
  });
}

function getItemTitle(booking) {
  if (booking.type === 'movie') {
    const movie = MOVIES.find(m => m.id === booking.itemId);
    return movie ? movie.title : 'Unknown Movie';
  } else {
    const event = getEvents().find(e => e.id === booking.itemId);
    return event ? event.title : 'Unknown Event';
  }
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'<','>':'>','"':'"',"'":'&#39;' })[m]); }
