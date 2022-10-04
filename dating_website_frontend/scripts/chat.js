const left_panel = document.getElementById("left_panel");
const message_box = document.getElementById("message_box");
const userInfo = JSON.parse(localStorage.getItem("user_info"));


const removeSelected=()=>{
  const selected = document.querySelectorAll(".selected");
  selected.forEach(element => {
    element.classList.remove("selected");
    
  });


}


const loadMessage = (data) => {
  message_box.innerHTML = ""
  if (data.status == "Success") {
    data.data.forEach(element => {

      if (element.id == userInfo.id) {
        const d = new Date(element.date * 1000);
        message_box.innerHTML += `
        <div class="send">
          <div class="date"><span>${d.toDateString()}</span></div>
          <div class="text"><span>${element.text}</span></div>
        </div>`;
      } else {
        const d = new Date(element.date * 1000);
        message_box.innerHTML += `
        <div class="received">
          <div class="date"><span>${d.toDateString()}</span></div>
          <div class="text"><span>${element.text}</span></div>
        </div>
        `;
      }
      message_box.innerHTML += `
      <div class="new-message">
      <input type="text" placeholder="Enter message" class="input">
      <button class="send-message">Send!</button>
      </div>`
    });

  }

}

const loadEvent = () => {
  const user_receiver = document.querySelectorAll(".user_receiver");
  user_receiver.forEach(element => {
    element.addEventListener("click", async () => {
      removeSelected()
      element.classList.add("selected")
      const url = `${dating_website.baseUrl}/messages/${element.getAttribute("data-value")}?token=${dating_website.token}`
      const res = await dating_website.getAPI(url);
      loadMessage(res.data)

    });
  });
  const user_senders = document.querySelectorAll(".user_senders");
  user_senders.forEach(element => {
    element.addEventListener("click", async () => {
      removeSelected()
      element.classList.add("selected")
      const url = `${dating_website.baseUrl}/messages/${element.getAttribute("data-value")}?token=${dating_website.token}`
      const res = await dating_website.getAPI(url);
      loadMessage(res.data)

    });
  });

}

const loadData = (data) => {
  data.senders.forEach(element => {
    left_panel.innerHTML += ` 
    <div class="user user_senders " data-value="${element.user_sender.id}">
     <div class="img">
       <img src="assets/client.png" alt="img">
     </div>
     <span>${element.user_sender.name}</span>
    </div>`;

  });
  data.receivers.forEach(element => {
      left_panel.innerHTML += ` 
    <div class="user user_receiver" data-value="${element.user_receiver.id}" >
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