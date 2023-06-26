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

let btn = document.getElementById("btn1");

btn.addEventListener("click", (event) => {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let gender = document.getElementById("gender").value;
  let age = document.getElementById("age").value;
  let experience = document.getElementById("experience").value;
  let specialization = document.getElementById("specialization").value;

  let obj = {
    name,
    email,
    password,
    gender,
    age,
    experience,
    specialization,
  };
  addDoctor(obj);
});

async function addDoctor(obj) {
  try {
    fetch("https://misty-poncho-cod.cyclic.app/doctor/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.mess);
        if (data.message === "Doctor Already Exist") {
          Toast.fire({
            icon: "warning",
            title: "Doctor Already Exist",
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Register Successfully",
          });
        }
      });
  } catch (error) {
    alert("BAD REQUEST");
  }
}
