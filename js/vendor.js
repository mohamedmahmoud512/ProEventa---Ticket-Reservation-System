// vendor.js
// Requires data.js, auth.js

document.addEventListener('DOMContentLoaded', function() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'vendor') {
    window.location.href = 'login.html';
    return;
  }

  renderVendorPanel();
});

function renderVendorPanel() {
  const vendorContent = document.getElementById('vendor-content');

  vendorContent.innerHTML = `
    <div class="vendor-section">
      <h2>Add New Event</h2>
      <form id="eventForm">
        <div class="form-group">
          <label for="title">Event Title:</label>
          <input type="text" id="title" required>
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" required></textarea>
        </div>
        <div class="form-group">
          <label for="date">Date:</label>
          <input type="date" id="date" required>
        </div>
        <div class="form-group">
          <label for="price">Price ($):</label>
          <input type="number" id="price" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="venue">Venue:</label>
          <input type="text" id="venue" required>
        </div>
        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" required>
        </div>
        <div class="form-group">
          <label for="capacity">Capacity:</label>
          <input type="number" id="capacity" min="1" required>
        </div>
        <button type="submit" class="btn">Add Event</button>
      </form>
    </div>
  `;

  // Handle form submission
  document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      date: document.getElementById('date').value,
      price: parseFloat(document.getElementById('price').value),
      venue: document.getElementById('venue').value,
      address: document.getElementById('address').value,
      capacity: parseInt(document.getElementById('capacity').value)
    };
    const events = getEvents();
    events.push(newEvent);
    setEvents(events);
    alert('Event added successfully!');
    document.getElementById('eventForm').reset();
  });
}
