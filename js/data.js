// data.js - Sample data for theatres, events, users, booking
// Uses localStorage for persistence

// Initialize data if not exists
if (!localStorage.getItem('THEATRES')) {
  localStorage.setItem('THEATRES', JSON.stringify([
    { id: 1, name: 'AMC Theatres', location: 'Boston, MA', address: '123 Main St', lat: 42.3601, lng: -71.0589 },
    { id: 2, name: 'Regal Cinemas', location: 'Cambridge, MA', address: '456 Elm St', lat: 42.3736, lng: -71.1097 },
    { id: 3, name: 'Cinemark', location: 'Somerville, MA', address: '789 Oak Ave', lat: 42.3876, lng: -71.0995 },
    { id: 4, name: 'Alamo Drafthouse', location: 'Brookline, MA', address: '101 Pine Rd', lat: 42.3318, lng: -71.1212 },
    { id: 5, name: 'Landmark Theatres', location: 'Newton, MA', address: '202 Maple Ln', lat: 42.3370, lng: -71.2092 },
    { id: 6, name: 'Showcase Cinemas', location: 'Waltham, MA', address: '303 Birch Blvd', lat: 42.3765, lng: -71.2356 },
    { id: 7, name: 'Cineplex Odeon', location: 'Quincy, MA', address: '404 Cedar St', lat: 42.2529, lng: -71.0023 },
    { id: 8, name: 'Marcus Theatres', location: 'Framingham, MA', address: '505 Spruce Ave', lat: 42.2793, lng: -71.4162 },
    { id: 9, name: 'Bow Tie Cinemas', location: 'Natick, MA', address: '606 Willow Rd', lat: 42.2830, lng: -71.3495 },
    { id: 10, name: 'Rialto Pictures', location: 'Arlington, MA', address: '707 Ash Ln', lat: 42.4154, lng: -71.1565 }
  ]));
}

if (!localStorage.getItem('EVENTS')) {
  localStorage.setItem('EVENTS', JSON.stringify([
    {
      id: 1,
      title: 'Food Festival in Boston',
      description: 'A grand food festival featuring cuisines from around the world.',
      date: '2023-12-15',
      price: 25,
      venue: 'Boston Commons',
      address: '139 Tremont St, Boston, MA',
      capacity: 1000,
      image: '../assets/festival.jpg'
    },
    {
      id: 2,
      title: 'Music Concert: Jazz Nights',
      description: 'An evening of smooth jazz with local and international artists.',
      date: '2023-12-20',
      price: 50,
      venue: 'House of Blues',
      address: '15 Lansdowne St, Boston, MA',
      capacity: 500,
      image: '../assets/music.jpg'
    },
    {
      id: 3,
      title: 'Art Exhibition: Modern Masters',
      description: 'Explore contemporary art from renowned artists.',
      date: '2023-12-25',
      price: 30,
      venue: 'Museum of Fine Arts',
      address: '465 Huntington Ave, Boston, MA',
      capacity: 300,
      image: '../assets/modern2.jpg'
    },
    {
      id: 4,
      title: 'Comedy Show: Laugh Out Loud',
      description: 'Hilarious stand-up comedy with top comedians.',
      date: '2023-12-28',
      price: 40,
      venue: 'Wilbur Theatre',
      address: '246 Tremont St, Boston, MA',
      capacity: 400,
      image: '../assets/comedy.jpg'
    },
    {
      id: 5,
      title: 'Theater Play: Romeo and Juliet',
      description: 'Classic Shakespearean drama brought to life.',
      date: '2024-01-05',
      price: 60,
      venue: 'American Repertory Theater',
      address: '64 Brattle St, Cambridge, MA',
      capacity: 600,
      image: '../assets/theater.jpg'
    },
    {
      id: 6,
      title: 'Rock Concert: Electric Vibes',
      description: 'High-energy rock performance by popular bands.',
      date: '2024-01-10',
      price: 55,
      venue: 'TD Garden',
      address: '100 Legends Way, Boston, MA',
      capacity: 2000,
      image: '../assets/rock.jpg'
    },
    {
      id: 7,
      title: 'Dance Festival: Rhythm & Motion',
      description: 'Vibrant dance performances from diverse cultures.',
      date: '2024-01-15',
      price: 35,
      venue: 'Berklee Performance Center',
      address: '136 Massachusetts Ave, Boston, MA',
      capacity: 800,
      image: '../assets/Avengers.jpg'
    },
    {
      id: 8,
      title: 'Film Screening: Indie Gems',
      description: 'Showcase of independent films and documentaries.',
      date: '2024-01-20',
      price: 20,
      venue: 'Brattle Theatre',
      address: '40 Brattle St, Cambridge, MA',
      capacity: 250,
      image: '../assets/film.jpg'
    },
    {
      id: 9,
      title: 'Poetry Reading: Words Alive',
      description: 'Intimate evening of spoken word and poetry.',
      date: '2024-01-25',
      price: 15,
      venue: 'Harvard Book Store',
      address: '1256 Massachusetts Ave, Cambridge, MA',
      capacity: 100,
      image: '../assets/poetry.jpg'
    },
    {
      id: 10,
      title: 'Magic Show: Illusion Masters',
      description: 'Mesmerizing magic tricks and illusions.',
      date: '2024-01-30',
      price: 45,
      venue: 'The Magic Castle',
      address: '102 Commonwealth Ave, Boston, MA',
      capacity: 350,
      image: '../assets/magic.jpg'
    }
  ]));
}

if (!localStorage.getItem('USERS')) {
  localStorage.setItem('USERS', JSON.stringify([
    {
      id: 1,
      username: 'alice',
      password: 'alice',
      role: 'customer',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      address: '123 Main St, Boston, MA',
      booking: []
    },
    {
      id: 2,
      username: 'bob',
      password: 'bob',
      role: 'vendor',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      address: '456 Elm St, Cambridge, MA',
      booking: []
    },
    {
      id: 3,
      username: 'admin',
      password: 'admin',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      address: '789 Oak Ave, Somerville, MA',
      booking: []
    }
  ]));
}

if (!localStorage.getItem('BOOKING')) {
  localStorage.setItem('BOOKING', JSON.stringify([]));
}

// Helper functions to get/set data
function getTheatres() { return JSON.parse(localStorage.getItem('THEATRES')) || []; }
function setTheatres(data) { localStorage.setItem('THEATRES', JSON.stringify(data)); }

function getEvents() { return JSON.parse(localStorage.getItem('EVENTS')) || []; }
function setEvents(data) { localStorage.setItem('EVENTS', JSON.stringify(data)); }

function getUsers() { return JSON.parse(localStorage.getItem('USERS')) || []; }
function setUsers(data) { localStorage.setItem('USERS', JSON.stringify(data)); }

function getBooking() { return JSON.parse(localStorage.getItem('BOOKING')) || []; }
function setBooking(data) { localStorage.setItem('BOOKING', JSON.stringify(data)); }

// Current user session
function getCurrentUser() { return JSON.parse(localStorage.getItem('currentUser')) || null; }
function setCurrentUser(user) { localStorage.setItem('currentUser', JSON.stringify(user)); }
function logout() { localStorage.removeItem('currentUser'); }

// Expire pending booking older than their expireAt timestamp
function expireOldBookings() {
  const booking = getBooking();
  const now = Date.now();
  let changed = false;
  booking.forEach(b => {
    if (b && b.status === 'pending' && b.expireAt && now > b.expireAt) {
      b.status = 'expired';
      changed = true;
    }
  });
  if (changed) setBooking(booking);
  return booking;
}

// Cancel a booking by id (mark as cancelled)
function cancelBooking(bookingId) {
  const booking = getBooking();
  const idx = booking.findIndex(b => b.id === bookingId);
  if (idx === -1) return false;
  booking[idx].status = 'cancelled';
  setBooking(booking);
  return true;
}

// Booking hold configuration (milliseconds)
function getBookingHoldMs() {
  const v = parseInt(localStorage.getItem('BOOKING_HOLD_MS'), 10);
  if (Number.isFinite(v) && v > 0) return v;
  return 10 * 60 * 1000; // default 10 minutes
}
function setBookingHoldMs(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return false;
  localStorage.setItem('BOOKING_HOLD_MS', String(ms));
  return true;
}
