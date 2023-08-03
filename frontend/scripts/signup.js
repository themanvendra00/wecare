import { navbar, footer } from "../components/navbar.js";
let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");
let signupBtn = document.getElementById('submit');

navbarContainer.innerHTML = navbar();
footerContainer.innerHTML = footer();

// ! Toaster
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// setting username
let userDetails = JSON.parse(localStorage.getItem("userDetails")) || null;

if (userDetails) {
  document.getElementById("user").innerText = userDetails?.name;
  document.getElementById("loginbtn").innerText = "Logout";
}

// redirect to account/login
let login_icon = document.getElementById("loginbtn");
login_icon.addEventListener("click", () => {
  if (userDetails) {
    localStorage.removeItem("userDetails");
    window.location.href = "login.html";
  } else {
    window.location.href = "login.html";
  }
});

// Home redirect
let logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let dob = document.getElementById("age").value;
  let gender = document.getElementById("gender").value;
  let contact = document.getElementById("contact").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  signupBtn.setAttribute('value', 'Loading...');

  let registerDetails = {
    name,
    dob,
    gender,
    contact,
    email,
    password,
  };


  fetch("http://localhost:3000/user/register", {
    method: "POST",
    body: JSON.stringify(registerDetails),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      signupBtn.setAttribute('value', 'Sign Up');
      if (data.message === "User Already Exist") {
        Toast.fire({
          icon: "warning",
          title: "Already a user, Plaese login!",
        });

        setTimeout(function () {
          window.location.href = "login.html";
        }, 2000);

      } else {
        Toast.fire({
          icon: "success",
          title: "Register Successfully",
        });

        setTimeout(function () {
          window.location.href = "login.html";
        }, 2000);
      }
    });
});
