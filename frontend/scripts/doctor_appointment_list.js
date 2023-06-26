import { navbar, footer } from "../components/navbar.js";
let navbarContainer = document.getElementById("navbar");
let footerContainer = document.getElementById("footer");
let storeData = [];

// Navbar
navbarContainer.innerHTML = navbar();
footerContainer.innerHTML = footer();

let token = JSON.parse(localStorage.getItem("token")) || null;

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

// Display user profile
function display(data) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  data.forEach((element) => {
    let row = document.createElement("tr");
    let col1 = document.createElement("td");
    col1.innerText = element.name;
    let col6 = document.createElement("td");
    col6.innerText = element.gender;
    let col7 = document.createElement("td");
    col7.innerText = element.symtoms;
    let col2 = document.createElement("td");
    col2.innerText = element.date;
    let col3 = document.createElement("td");
    col3.innerText = element.time;
    let col4 = document.createElement("td");
    let col8 = document.createElement("td");
    let col9 = document.createElement("td");
    col4.innerText = element.status;
    if (element.status == "pending") {
      col8.innerHTML = `<button class="accept btn3" data-id=${
        element._id
      } onclick="${accept(element._id)}">Approve</button>`;
      col9.innerHTML = `<button class="reject btn3" data-id=${
        element._id
      } onclick="${reject(element._id)}">Reject</button>`;
      col4.style.color = "orange";
    } else if (element.status == "approved") {
      col4.style.color = "green";
    } else {
      col4.style.color = "red";
    }
    let col5 = document.createElement("td");
    if (element.roomId && element.status == "approved") {
      col5.innerText = element.roomId;
    } else {
      col5.innerText = "N/A";
    }

    row.append(col1, col6, col7, col2, col3, col5, col4, col8, col9);
    tbody.append(row);
  });
}

// Fetch Data from database
let not_available = document.getElementById("not_available");
async function getData() {
  let data = JSON.parse(localStorage.getItem("doctorDetails"));
  let userId = data._id;
  let name = data.name;
  if (userId) {
    try {
      let res = await fetch(
        `http://localhost:7500/appointment/doctor/get/${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      let data = await res.json();
      if (data.length > 0) {
        not_available.style.display = "none";
      }
      console.log(data);
      storeData = data;
      display(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    Toast.fire({
      icon: "error",
      title: "Please Login again!",
    });
  }
}
getData();

// setting username
let doctorDetails = JSON.parse(localStorage.getItem("doctorDetails")) || null;

if (doctorDetails) {
  document.getElementById("user").innerText = doctorDetails?.name;
  document.getElementById("loginbtn").innerText = "Logout";
}

// redirect to account/login
let login_icon = document.getElementById("loginbtn");
login_icon.addEventListener("click", () => {
  if (doctorDetails) {
    localStorage.removeItem("doctorDetails");
    window.location.href = "login.html";
  } else {
    window.location.href = "login.html";
  }
});

let navRedirect = document.getElementById("navredirect");

navRedirect.addEventListener("click", () => {
  if (userDetails) {
    window.location.href = "appointment_form.html";
  } else {
    Toast.fire({
      icon: "error",
      title: "Please Login again!",
    });
  }
});

let filter = document.getElementById("filter");
filter.addEventListener("change", () => {
  if (filter.value == "") {
    display(storeData);
  } else {
    let filterData = storeData.filter((ele) => {
      return ele.status == filter.value;
    });
    display(filterData);
  }
});

let data = JSON.parse(localStorage.getItem("userDetails")) || null;
let email = data.email;
function accept(id) {
  fetch(`http://localhost:7500/appointment/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      email: `${email}`,
      Authorization: token,
    },
    body: JSON.stringify({ status: "approved" }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        alert("Appintment Approved");
        location.reload();
      }
    });
}
function reject(id) {
  fetch(`http://localhost:7500/appointment/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      email: `${email}`,
      Authorization: token,
    },
    body: JSON.stringify({ status: "rejected" }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        alert("Appointment Rejected");
        location.reload();
      }
    });
}
