import { navbar, footer } from "../components/navbar.js";
let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");
let loginBtn = document.getElementById("submit");

navbarContainer.innerHTML = navbar();
footerContainer.innerHTML = footer();

// setting username
let userDetails = JSON.parse(localStorage.getItem("doctorDetails")) || null;

if (userDetails) {
  document.getElementById("user").innerText = userDetails?.name;
  document.getElementById("loginbtn").innerText = "Logout";
}

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

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  loginBtn.setAttribute("value", "Loading...");

  let loginDetails = {
    email,
    password,
  };

  fetch("http://localhost:3000/doctor/login", {
    method: "POST",
    body: JSON.stringify(loginDetails),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      loginBtn.setAttribute("value", "Loading...");
      if (data.message == "Invalid Email or Password") {
        Toast.fire({
          icon: "error",
          title: "Invalid Email or Password",
        });
      } else if (data.message == "User not found") {
        Toast.fire({
          icon: "warning",
          title: "User not found",
        });
      } else {
        localStorage.setItem("doctorDetails", JSON.stringify(data.User));
        localStorage.setItem("token", JSON.stringify(data.token));
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });

        setTimeout(function () {
          window.location.href = "doctor-appointment-list.html";
        }, 2000);
      }
    })
    .catch((error) => console.log(error));
});
