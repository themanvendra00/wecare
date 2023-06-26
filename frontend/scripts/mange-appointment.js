let { email, name } = JSON.parse(localStorage.getItem("userDetailsforadmin"));

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

let Dat;
async function getData() {
  let key = "owais@gmail.com";

  if (key) {
    try {
      let res = await fetch(
        "https://misty-poncho-cod.cyclic.app/appointment/getall",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            email: `${email}`,
            Authorization: token,
          },
        }
      );
      let data = await res.json();
      console.log(data);
      Dat = data;
      showAppointments(data);
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

function showAppointments(Data) {
  let appointments = Data.map((item) => {
    return `
      <tr>
        <td>
          <h4>${item._id}</h4>
        </td>
        <td>
          <h4>${item.date}</h4>
        </td>
        <td>
          <h4>${item.time}</h4>
        </td>
        <td>
          <h4>${item.status}</h4>
        </td>
        <td>
        <h4>${item.doctor}</h4>
        </td>
        <td id="room">
        <h4>${item.roomId || "NA"}</h4>
        </td>
      </tr>
      `;
  });

  document.getElementById("appointment").innerHTML = appointments.join(" ");
}

let select = document
  .getElementById("myselect")
  .addEventListener("change", () => {
    let val = document.getElementById("myselect").value;
    let filtereddata = Dat.filter(function (element) {
      return element.status == val;
    });

    showAppointments(filtereddata);
  });

let mydr = document
  .getElementById("mydoctor")
  .addEventListener("change", () => {
    let val = document.getElementById("mydoctor").value;
    let filterdata = Dat.filter(function (element) {
      return element.doctor == val;
    });

    showAppointments(filterdata);
  });

//console.log(select)
