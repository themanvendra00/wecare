let {email,name}=JSON.parse(localStorage.getItem("userDetailsforadmin"));

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

let Dat ;
async function getData() {
  let key ="owais@gmail.com"
  
  if( key){
      try {
          let res = await fetch("https://important-toad-pajamas.cyclic.app/appointment/getall", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "email":`${email}`
                  
              },
              
          })
          let data = await res.json();
          console.log(data);
          Dat=data;
          showAppointments(data);
      } catch (error) {
          console.log(error);
      }
     
  }
  else{
    Toast.fire({
      icon: "error",
      title: "Please Login again!",
    });
  }
  
}
getData();


function showAppointments(Data){
   let appointments = Data.map((item)=>{
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
        <h4>${item.roomId  || "NA"}</h4>
        </td>
        <td>
          <button class="accept btn3" data-id=${item._id}>Approve</button>
        </td>
        <td>
          <button class="reject btn3" data-id=${item._id}>Reject</button>
        </td>
      </tr>
      `
   })

   document.getElementById("appointment").innerHTML=appointments.join(" ")

   let all_accept_btns = document.querySelectorAll(".accept")

   for(accept_btn of  all_accept_btns){
       accept_btn.addEventListener("click",(event)=>{
            let id = event.target.dataset.id
            accept(id)
       })
   }
   let all_reject_btns = document.querySelectorAll(".reject")

   for(reject_btn of  all_reject_btns){
       reject_btn.addEventListener("click",(event)=>{
            let id = event.target.dataset.id
            reject(id)
       })
   }

   function accept(id){
    fetch(`https://important-toad-pajamas.cyclic.app/appointment/update/${id}`,{
        method:"PATCH",
        headers:{
          "Content-Type": "application/json",
          "email":`${email}`
        },
        body:JSON.stringify({status:"approved",name:name})
    })
    .then(res=>res.json())
    .then(res=>{
      if(res){
        alert("status updated")
        location.reload()
      }
      
    })
  }
  function reject(id){
    fetch(`https://important-toad-pajamas.cyclic.app/appointment/update/${id}`,{
        method:"PATCH",
        headers:{
          "Content-Type": "application/json",
          "email":`${email}`
        },
        body:JSON.stringify({status:"rejected"})
    })
    .then(res=>res.json())
    .then(res=>{
      if(res){
        alert("status updated");
        location.reload()
      }
      
    })
  }
}

 let select = document.getElementById("myselect").addEventListener("change",()=>{
  let val = document.getElementById("myselect").value
  let filtereddata=Dat.filter(function(element){
    return element.status==val
})

  
  showAppointments(filtereddata)


 })

 let mydr = document.getElementById("mydoctor").addEventListener("change",()=>{
  let val = document.getElementById("mydoctor").value
  let filterdata=Dat.filter(function(element){
    return element.doctor==val
})

  
  showAppointments(filterdata)


 })

 //console.log(select)

  

   




