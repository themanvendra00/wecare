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

let form = document.querySelector("form");

form.addEventListener("submit", getAppointment);

// function to post a appointment

async function getAppointment(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let Email = JSON.parse(localStorage.getItem("userDetails"));
  let phone = document.getElementById("phone").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;
  let doctor = document.getElementById("doctor").value;
  let symtoms = document.getElementById("symptoms").value;
  let gender = document.getElementById("gender").value;

  if (
    name == "" ||
    Email == "" ||
    phone == "" ||
    date == "" ||
    time == "" ||
    doctor == "" ||
    symtoms == "" ||
    gender == ""
  ) {
    Toast.fire({
      icon: "warning",
      title: "Please Login again",
    });
  } else {
    let appointment = {
      name: name,
      email: Email.email,
      phone: phone,
      date: date,
      time: time,
      doctor: doctor,
      symtoms: symtoms,
      gender: gender,
    };
    // let key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDI1NjcwYzRmZjJhY2RlYTRmZDQ0MWUiLCJpYXQiOjE2ODAxNzI4MzN9.WPSwGoSicD9yx25IxL1lkd1a8SnwzkicUTn_WvS6itA"
    let Data = JSON.parse(localStorage.getItem("userDetails"));
    let email = Data.email;
    let response = await fetch(
      "https://important-toad-pajamas.cyclic.app/appointment/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization":`${key}`,
          email: `${email}`,
        },
        body: JSON.stringify(appointment),
      }
    );
    let data = await response.json();
    if (data == "Please Login again") {
      Toast.fire({
        icon: "warning",
        title: "Please Login again!",
      });

      setTimeout(function () {
        window.location.href = "login.html";
      }, 2000);
    } else if (data == "Appointment Created") {
      Toast.fire({
        icon: "success",
        title: "Appointment created!",
      });

      setTimeout(function () {
        window.location.href = "appointment_list.html";
      }, 2000);
    } else {
      Toast.fire({
        icon: "error",
        title: "Slot Not Available, Try a diffrent time slot!",
      });
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
