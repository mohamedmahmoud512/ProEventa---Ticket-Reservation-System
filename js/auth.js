// auth.js - Authentication logic

document.addEventListener('DOMContentLoaded', function() {
  updateNav();
});

function updateNav() {
  const currentUser = getCurrentUser();
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    if (currentUser) {
      loginLink.textContent = 'Logout';
      loginLink.href = '#';
      loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
        window.location.href = 'index.html';
      });
    } else {
      loginLink.textContent = 'Login';
      loginLink.href = 'login.html';
    }
  }
}

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      window.location.href = '../index.html';
    } else {
      document.getElementById('errorMsg').textContent = 'Invalid username or password';
      document.getElementById('errorMsg').style.display = 'block';
    }
  });
}

// Role-based access
function requireRole(role) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== role) {
    window.location.href = 'login.html';
  }
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function getUserRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}
