// admin.js
// Requires data.js, auth.js, movies-data.js

document.addEventListener('DOMContentLoaded', function() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  renderAdminPanel();
});

function renderAdminPanel() {
  const adminContent = document.getElementById('admin-content');

  adminContent.innerHTML = `
    <div class="admin-section">
      <h2>Manage Customers</h2>
      <div id="customers-list"></div>
    </div>
    <div class="admin-section">
      <h2>View Booking</h2>
      <div id="booking-list"></div>
    </div>
    <div class="admin-section">
      <h2>Manage Events</h2>
      <button id="add-event-btn" class="btn">Add New Event</button>
      <div id="events-list"></div>
    </div>
    <div class="admin-section">
      <h2>Create Booking</h2>
      <form id="createBookingForm">
        <div class="form-group">
          <label for="bookingType">Type:</label>
          <select id="bookingType" required>
            <option value="movie">Movie</option>
            <option value="event">Event</option>
          </select>
        </div>
        <div class="form-group">
          <label for="itemId">Item ID:</label>
          <input type="number" id="itemId" required>
        </div>
        <div class="form-group">
          <label for="bookingEmail">Email:</label>
          <input type="email" id="bookingEmail" required>
        </div>
        <button type="submit" class="btn">Create Booking</button>
      </form>
    </div>
  `;

  renderCustomers();
  renderBooking();
  renderEvents();

  // Handle add event button
  document.getElementById('add-event-btn').addEventListener('click', () => {
    const title = prompt('Event Title:');
    if (title) {
      const newEvent = {
        id: Date.now(),
        title: title,
        description: prompt('Description:') || '',
        date: prompt('Date (YYYY-MM-DD):') || '',
        price: parseFloat(prompt('Price:') || '0'),
        venue: prompt('Venue:') || '',
        address: prompt('Address:') || '',
        capacity: parseInt(prompt('Capacity:') || '100')
      };
      const events = getEvents();
      events.push(newEvent);
      setEvents(events);
      renderEvents();
    }
  });

  // Handle create booking form
  document.getElementById('createBookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('bookingType').value;
    const itemId = parseInt(document.getElementById('itemId').value);
    const email = document.getElementById('bookingEmail').value;
    const booking = {
      id: Date.now(),
      type: type,
      itemId: itemId,
      theatreId: null,
      showtime: type === 'movie' ? 'Admin Created' : '',
      email: email,
      seats: ['Admin'],
      userId: null,
      status: 'confirmed'
    };
    const bookingArray = getBooking();
    bookingArray.push(booking);
    setBooking(bookingArray);
    alert('Booking created successfully!');
    document.getElementById('createBookingForm').reset();
    renderBooking();
  });
}

function renderCustomers() {
  const customersList = document.getElementById('customers-list');
  const customers = getUsers().filter(u => u.role === 'customer');
  customersList.innerHTML = customers.map(c => `
    <div class="customer-item">
      <p><strong>${c.firstName} ${c.lastName}</strong> (${c.email})</p>
      <button onclick="deleteUser(${c.id})" class="btn">Delete</button>
    </div>
  `).join('');
}

function renderBooking() {
  const bookingList = document.getElementById('booking-list');
  const booking = getBooking();
  bookingList.innerHTML = booking.map(b => `
    <div class="booking-item">
      <p><strong>${b.type}:</strong> ${getItemTitle(b)} | <strong>Email:</strong> ${b.email} | <strong>Status:</strong> ${b.status}</p>
      <button onclick="updateBookingStatus(${b.id}, 'confirmed')" class="btn">Confirm</button>
      <button onclick="updateBookingStatus(${b.id}, 'cancelled')" class="btn">Cancel</button>
    </div>
  `).join('');
}

function renderEvents() {
  const eventsList = document.getElementById('events-list');
  const events = getEvents();
  eventsList.innerHTML = events.map(e => `
    <div class="event-item">
      <p><strong>${e.title}</strong> - ${e.date} - $${e.price}</p>
      <button onclick="deleteEvent(${e.id})" class="btn">Delete</button>
    </div>
  `).join('');
}

function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    const users = getUsers().filter(u => u.id !== id);
    setUsers(users);
    renderCustomers();
  }
}

function updateBookingStatus(id, status) {
  const bookingArray = getBooking();
  const bookingItem = bookingArray.find(b => b.id === id);
  if (bookingItem) {
    bookingItem.status = status;
    setBooking(bookingArray);
    renderBooking();
  }
}

function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event?')) {
    const events = getEvents().filter(e => e.id !== id);
    setEvents(events);
    renderEvents();
  }
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
