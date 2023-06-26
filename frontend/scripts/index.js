import { navbar, footer } from "../components/navbar.js";
let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");

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

// Home redirect
let logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

let btn = document.getElementById("redirectBtn");

// setting username
let userDetails = JSON.parse(localStorage.getItem("userDetails")) || null;

let div = document.getElementById("redirectBtn");
if (userDetails) {
  document.getElementById("user").innerText = userDetails?.name;
  document.getElementById("loginbtn").innerText = "Logout";
  div.innerHTML = `<a href="./appointment_form.html" class="flex"><i class="fa-solid fa-video"></i> Book appointment now</a>`;
} else {
  div.innerHTML = `<a href="#" class="flex" id="chhodyar"><i class="fa-solid fa-video"></i> Book appointment now</a>`;
  let temp = document.getElementById("chhodyar");
  temp.addEventListener("click", () => {
    Toast.fire({
      icon: "error",
      title: "Please login first!",
    });
  });
}

// redirect to account/login
let login_icon = document.getElementById("loginbtn");
let navRedirect = document.getElementById("navredirect");

navRedirect.addEventListener("click", () => {
  if (userDetails) {
    window.location.href = "appointment_form.html";
  } else {
    Toast.fire({
      icon: "error",
      title: "Please login first!",
    });
  }
});

login_icon.addEventListener("click", () => {
  if (userDetails) {
    localStorage.removeItem("userDetails");
    window.location.href = "login.html";
  } else {
    window.location.href = "login.html";
  }
});
