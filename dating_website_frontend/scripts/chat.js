const left_panel = document.getElementById("left_panel");


const loadData = (data) => {
  data.senders.forEach(element => {
    left_panel.innerHTML += ` 
    <div class="user  selected" data-value="${element.user_sender.id}">
     <div class="img">
       <img src="assets/client.png" alt="img">
     </div>
     <span>${element.user_sender.name}</span>
    </div>`;

  });
  data.receivers.forEach(element => {
      left_panel.innerHTML += ` 
    <div class="user " data-value="${element.user_receiver.id}" >
     <div class="img">
       <img src="assets/client.png" alt="img">
     </div>
     <span>${element.user_receiver.name}</span>
    </div>`;

    }

  );

  // add event to each user to see chat
  loadEvent()

}


// get info of all user who text them 
const user_info = async () => {
  const url = `${dating_website.baseUrl}/users_message?token=${dating_website.token}`
  const res = await dating_website.getAPI(url);
  if (res.data.status == "Success") {
    loadData(res.data.data);
  }
}


// check if login by checking data in  localStorage
// check if user are login in and chck if token are valid
dating_website.checkLogin();

//add event fo logout
dating_website.logout();

// get info of all user who text them 
user_info();