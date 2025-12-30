// booking.js
// Requires movies-data.js, data.js
// Global flag to enable/disable seat clicking (controlled by Start Selecting)
let seatSelectionEnabled = false;
// Current pending booking id (if created from this page)
let currentPendingBookingId = null;
let holdCountdownInterval = null;
let expiryWatcherInterval = null;
// Array to track selected seat IDs
let selectedSeats = [];
function getQueryParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

const type = getQueryParam('type'); // 'movie' or 'event'
const id = parseInt(getQueryParam('id'), 10);
const bookingForm = document.getElementById('booking-form');

if (!type || !id) {
  bookingForm.innerHTML = `<div style="color:var(--muted)">Invalid booking request. <a href="Home.html">Back to home</a></div>`;
} else {
  let item;
  if (type === 'movie') {
    item = MOVIES.find(m => m.id === id);
  } else if (type === 'event') {
    item = getEvents().find(e => e.id === id);
  }

  if (!item) {
    bookingForm.innerHTML = `<div style="color:var(--muted)">Item not found. <a href="index.html">Back to home</a></div>`;
  } else {
    renderBookingForm(item);
  }
}

function renderBookingForm(item) {
  const currentUser = getCurrentUser();
  const isMovie = type === 'movie';

  bookingForm.innerHTML = `
    <div class="booking-header">
      <h1 class="booking-title">Fill The Required Details Below And Select Your Seats</h1>
    </div>
    <form id="ticketForm">
      <div class="form-row">
        <div class="form-group">
          <label for="email">📧 Email Field <span class="required">*</span></label>
          <input type="email" id="email" placeholder="man@man.com" value="${currentUser ? currentUser.email : ''}" required>
        </div>
        <div class="form-group">
          <label for="seats">🔢 Number of Seats</label>
          <input type="number" id="seats" min="1" max="10" value="1" required>
        </div>
      </div>
      <div class="price-label">
        <span class="price-text">🎫 Price is $12.50 Per Ticket</span>
      </div>
      <div id="booking-summary-display" class="booking-summary-display" style="display:none;">
        <p id="num-seats">Number of Seats: 0</p>
        <p id="selected-seats">Seats Selected: None</p>
        <p id="total-price">Total Price: $0.00</p>
      </div>
      <button type="button" id="startSelecting" class="start-selecting-btn">▶ Start Selecting</button>
      <div id="seat-legend" class="seat-legend" style="display:none;">
        <div class="legend-item"><div class="legend-color green"></div> Selected Seat</div>
        <div class="legend-item"><div class="legend-color red"></div> Reserved Seat</div>
        <div class="legend-item"><div class="legend-color orange"></div> Pending Seat</div>
        <div class="legend-item"><div class="legend-color white"></div> Available Seat</div>
      </div>
      <div id="seat-selection" class="seat-selection" style="display:none;">
        <div id="seat-grid" class="seat-grid"></div>
        <div class="screen-indicator">
          <div class="screen-bar">SCREEN</div>
        </div>
      </div>
      <div id="confirmation-area" class="confirmation-area" style="display:none;">
        <button type="button" id="confirmSelection" class="confirm-btn">Confirm Selection</button>
        <div id="hold-info" class="hold-info" style="display:none;margin-bottom:8px"></div>
        <div id="booking-summary" class="booking-summary" style="display:none;">
          <table class="summary-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number of Seats</th>
                <th>Seats Selected</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody id="summary-body">
            </tbody>
          </table>
          <button type="submit" class="checkout-btn">Check out</button>
        </div>
      </div>
    </form>
  `;

  // Move booking summary into the seat-selection container so it can overlay the map
  const bookingSummaryEl = document.getElementById('booking-summary');
  const seatSelectionEl = document.getElementById('seat-selection');
  if (bookingSummaryEl && seatSelectionEl) {
    // Append booking summary inside seat-selection to allow absolute overlay positioning
    seatSelectionEl.appendChild(bookingSummaryEl);
  }

  // seatSelectionEnabled is a global flag (do not redeclare here)

  // Start Selecting button
  document.getElementById('startSelecting').addEventListener('click', () => {
    seatSelectionEnabled = true;
    document.getElementById('seat-legend').style.display = 'flex';
    document.getElementById('seat-selection').style.display = 'block';
    document.getElementById('confirmation-area').style.display = 'block';
    renderSeatGrid();
    updateSummary();

    // Start a periodic expiry watcher while booking page is open
    if (!expiryWatcherInterval) {
      expiryWatcherInterval = setInterval(() => {
        expireOldBookings();
        renderSeatGrid();
        updateHoldDisplayForCurrent();
      }, 10000); // every 10s
    }
  });

  // Confirm Selection button
  document.getElementById('confirmSelection').addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    const email = document.getElementById('email').value;
    const numSeats = parseInt(document.getElementById('seats').value, 10);
    if (selectedSeats.length !== numSeats) {
      alert(`Please select exactly ${numSeats} seat(s).`);
      return;
    }

    // Create a pending booking to reserve seats until payment completes
    const holdMs = getBookingHoldMs();
    const booking = {
      id: Date.now(),
      type: type,
      itemId: id,
      email: email,
      seats: Array.from(selectedSeats).map(s => s.dataset.seat),
      userId: currentUser ? currentUser.id : null,
      status: 'pending',
      expireAt: Date.now() + holdMs // hold configurable
    };
    const bookingArray = getBooking();
    bookingArray.push(booking);
    setBooking(bookingArray);

    const seatsSelected = booking.seats.join(', ');
    const totalPrice = booking.seats.length * 12.50;
    document.getElementById('summary-body').innerHTML = `
      <tr>
        <td>${escapeHtml(email)}</td>
        <td>${booking.seats.length}</td>
        <td>${seatsSelected}</td>
        <td>$${totalPrice}</td>
      </tr>
    `;

    // Show proceed-to-payment button that navigates to payment page
    document.getElementById('booking-summary').style.display = 'block';
    const proceedBtn = document.createElement('a');
    proceedBtn.href = `payment.html?bookingId=${booking.id}`;
    proceedBtn.className = 'checkout-btn';
    proceedBtn.textContent = 'Proceed to Payment';
    // Remove any existing proceed button
    const existing = document.getElementById('proceed-to-payment');
    if (existing) existing.remove();
    proceedBtn.id = 'proceed-to-payment';
    document.getElementById('booking-summary').appendChild(proceedBtn);

    // Disable further selecting so seats remain reserved until payment
    seatSelectionEnabled = false;

    // Re-render grid so pending seats show up
    renderSeatGrid();

    // remember pending booking and start countdown UI
    currentPendingBookingId = booking.id;
    startHoldCountdown(booking.expireAt);
  });

  // No direct form submit handler — checkout flow happens on payment page after payment.
}

function startHoldCountdown(expireAt) {
  stopHoldCountdown();
  const holdInfo = document.getElementById('hold-info');
  if (!holdInfo) return;
  holdInfo.style.display = 'block';
  function update() {
    const now = Date.now();
    const diff = Math.max(0, expireAt - now);
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    holdInfo.innerHTML = `<strong>Reservation hold:</strong> <span id="hold-countdown">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</span> remaining`;
    if (diff <= 0) {
      // expired
      stopHoldCountdown();
      holdInfo.innerHTML = `<strong>Reservation expired.</strong>`;
      // refresh grid to release seats
      expireOldBookings();
      renderSeatGrid();
      currentPendingBookingId = null;
    }
  }
  update();
  holdCountdownInterval = setInterval(update, 1000);
}

function stopHoldCountdown() {
  if (holdCountdownInterval) { clearInterval(holdCountdownInterval); holdCountdownInterval = null; }
}

function updateHoldDisplayForCurrent() {
  if (!currentPendingBookingId) {
    // try to detect a pending booking for this email+item (user may reload)
    const email = document.getElementById('email') ? document.getElementById('email').value : null;
    if (email) {
      const bookingArray = getBooking();
      const b = bookingArray.find(x => x.status === 'pending' && x.itemId === id && x.email === email);
      if (b) {
        currentPendingBookingId = b.id;
        startHoldCountdown(b.expireAt);
      }
    }
    return;
  }
  // If we have a current id, ensure it's still pending and update countdown target
  const bookingArray = getBooking();
  const b = bookingArray.find(x => x.id === currentPendingBookingId);
  if (!b || b.status !== 'pending') {
    stopHoldCountdown();
    currentPendingBookingId = null;
    const holdInfo = document.getElementById('hold-info'); if (holdInfo) holdInfo.style.display = 'none';
  } else {
    // ensure countdown is running for this expireAt
    startHoldCountdown(b.expireAt);
  }
}

function renderSeatGrid() {
  const seatGrid = document.getElementById('seat-grid');
  const rows = 10; // number of numeric rows (1..10)
  const cols = 10; // number of letter columns (A..J)
  seatGrid.innerHTML = '';

  // Expire any old pending booking first (from data.js helper)
  const bookingArray = expireOldBookings();

  // Determine reserved seats from existing booking for this item
  const reservedConfirmed = new Set();
  const reservedPending = new Set();
  bookingArray.forEach(b => {
    if (b && b.type === type && parseInt(b.itemId, 10) === id && Array.isArray(b.seats)) {
      if (b.status === 'confirmed') b.seats.forEach(s => reservedConfirmed.add(s));
      if (b.status === 'pending') b.seats.forEach(s => reservedPending.add(s));
    }
  });

  // Header row with column letters A..J
  const header = document.createElement('div');
  header.className = 'seat-row header';
  header.appendChild(document.createElement('div')); // empty corner
  for (let c = 0; c < cols; c++) {
    const colLabel = document.createElement('div');
    colLabel.className = 'col-label';
    colLabel.textContent = String.fromCharCode(65 + c);
    header.appendChild(colLabel);
  }
  seatGrid.appendChild(header);

  // Rows
  for (let r = 0; r < rows; r++) {
    const rowWrap = document.createElement('div');
    rowWrap.className = 'seat-row';
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    rowLabel.textContent = (r + 1);
    rowWrap.appendChild(rowLabel);

    for (let c = 0; c < cols; c++) {
      const seat = document.createElement('div');
      const seatName = `${String.fromCharCode(65 + c)}${r + 1}`; // Column letter + row number
      seat.dataset.seat = seatName;
      seat.title = seatName; // tooltip on hover

      if (reservedConfirmed.has(seatName)) {
        seat.className = 'seat reserved';
      } else if (reservedPending.has(seatName)) {
        seat.className = 'seat pending';
      } else {
        seat.className = 'seat available';
        seat.addEventListener('click', () => toggleSeat(seat));
      }

      // inner icon element for visual box (SVG for crisper visuals)
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'seat-icon');
      svg.setAttribute('width', '18');
      svg.setAttribute('height', '12');
      svg.setAttribute('viewBox', '0 0 18 12');
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('class', 'seat-svg-rect');
      rect.setAttribute('x', '0.5');
      rect.setAttribute('y', '0.5');
      rect.setAttribute('width', '17');
      rect.setAttribute('height', '11');
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');
      svg.appendChild(rect);
      seat.appendChild(svg);

      rowWrap.appendChild(seat);
    }

    seatGrid.appendChild(rowWrap);
  }
}

function toggleSeat(seat) {
  if (!seatSelectionEnabled) return;
  if (seat.classList.contains('reserved')) return;
  const seatId = seat.dataset.seat;
  const maxSeats = parseInt(document.getElementById('seats').value, 10) || 1;
  if (seat.classList.contains('selected')) {
    seat.classList.remove('selected');
    selectedSeats = selectedSeats.filter(s => s !== seatId);
  } else {
    if (selectedSeats.length >= maxSeats) {
      alert(`You can select up to ${maxSeats} seat(s).`);
      return;
    }
    seat.classList.add('selected');
    selectedSeats.push(seatId);
  }
  updateSummary();
}

function updateSummary() {
  const numSeats = selectedSeats.length;
  const seatsSelected = selectedSeats.join(', ') || 'None';
  const totalPrice = numSeats * 12.50;
  document.getElementById('num-seats').textContent = `Number of Seats: ${numSeats}`;
  document.getElementById('selected-seats').textContent = `Seats Selected: ${seatsSelected}`;
  document.getElementById('total-price').textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'<','>':'>','"':'"',"'":'&#39;' })[m]); }
