document.addEventListener("DOMContentLoaded", function () {
  let Email = document.getElementById("Email");
  let Password = document.getElementById("password");
  let Login = document.getElementById("Login");
  let FoundError = document.getElementById("FoundError");
  const loginLink = document.getElementById("login-link");
  const isLoggedIn = localStorage.getItem("loggedIn");
  let Users = [];
  if (localStorage.getItem("Users") != null) {
    Users = JSON.parse(localStorage.getItem("Users"));
  }
  function profile() {
    window.location.href = "../index.html";
    document.addEventListener("DOMContentLoaded", function () {
      if (loginLink && isLoggedIn === "true") {
        loginLink.innerText = "Profile";
        loginLink.href = "../pages/profile.html";
      }
    });
  }
  Login.addEventListener("click", login);

  function login() {
    console.log("Login clicked"); // اختبار مهم جدًا

    if (Email.value !== "" && Password.value !== "") {
      if (Users.length === 0) {
        FoundError.style.display = "block";
        FoundError.innerText = "No users registered yet";
        return;
      }

      let found = false;

      for (let i = 0; i < Users.length; i++) {
        if (
          Email.value === Users[i].email &&
          Password.value === Users[i].password
        ) {
          localStorage.setItem("index", i);
          profile();
          found = true;
          break;
        }
      }

      if (!found) {
        FoundError.style.display = "block";
        FoundError.innerText = "Email or password is incorrect";
      }
    }
  }
});

// let Email = document.getElementById("Email");
// let Password = document.getElementById("password");
// let Login = document.getElementById("Login");
// let EmailError = document.getElementById("EmailError");
// let PasswordError = document.getElementById("PasswordError");
// let FoundError = document.getElementById("FoundError");
// let Users = [];
// let index;
// if (localStorage.getItem("Users") != null) {
//     Users = JSON.parse(localStorage.getItem("Users"));
// }
// Login.addEventListener("click", function () {
//     // console.log("clicked");
//   login();
// });
// // function login() {
// //   if (Email.value != "" && Password.value != "") {
// //     if (Users.length == 0) {
// //       FoundError.style.display = "block";
// //       setTimeout(function () {
// //         FoundError.style.display = "none";
// //       }, 3000);
// //     }
// //     for (let i = 0; i < Users.length; i++) {
// //       if (
// //         Email.value == Users[i].email &&
// //         Password.value == Users[i].password
// //       ) {
// //         index = i;
// //         localStorage.setItem("index", JSON.stringify(index));
// //         window.location.href = "../index.html";
// //       }
// //     }
// //   }
// // }
// function login() {
//   if (Email.value !== "" && Password.value !== "") {

//     if (Users.length === 0) {
//       FoundError.style.display = "block";
//       FoundError.innerText = "No users registered yet";
//       return;
//     }

//     let found = false;

//     for (let i = 0; i < Users.length; i++) {
//       if (
//         Email.value === Users[i].email &&
//         Password.value === Users[i].password
//       ) {
//         localStorage.setItem("index", i);
//         window.location.href = "../index.html";
//         found = true;
//         break;
//       }
//     }

//     if (!found) {
//       FoundError.style.display = "block";
//       FoundError.innerText = "Email or password is incorrect";
//       setTimeout(() => {
//         FoundError.style.display = "none";
//       }, 3000);
//     }
//   }
// }
