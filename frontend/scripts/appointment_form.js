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

let token = JSON.parse(localStorage.getItem("token")) || null;

let form = document.querySelector("form");

form.addEventListener("submit", getAppointment);

// function to post a appointment
async function getAppointment(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let Email = JSON.parse(localStorage.getItem("userDetails"));
  let gender = document.getElementById("gender").value;
  let contact = document.getElementById("phone").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;
  let doctor = document.getElementById("doctor").value;
  let symtoms = document.getElementById("symptoms").value;

  if (
    name == "" ||
    Email == "" ||
    contact == "" ||
    date == "" ||
    time == "" ||
    doctor == "" ||
    symtoms == "" ||
    gender == ""
  ) {
    Toast.fire({
      icon: "warning",
      title: "Please fill all the details",
    });
  } else {
    let appointment = {
      name: name,
      email: Email.email,
      contact: contact,
      date: date,
      time: time,
      doctor: doctor,
      symtoms: symtoms,
      gender: gender,
    };

    console.log(appointment)
    let Data = JSON.parse(localStorage.getItem("userDetails"));
    let email = Data.email;
    let response = await fetch("https://misty-poncho-cod.cyclic.app/appointment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(appointment),
    });
    let data = await response.json();
    if (data.message == "Please Login Again") {
      Toast.fire({
        icon: "warning",
        title: "Please Login Again!",
      });

      setTimeout(function () {
        window.location.href = "login.html";
      }, 2000);
    } else if (data.message == "Slot Not Available") {
      Toast.fire({
        icon: "error",
        title: "Slot Not Available, Try a diffrent time slot!",
      });
    } else {
      Toast.fire({
        icon: "success",
        title: "Appointment Created!",
      });
      setTimeout(function () {
        window.location.href = "appointment_list.html";
      }, 2000);
    }
  }
}

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
