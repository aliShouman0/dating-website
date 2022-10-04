const left_panel = document.getElementById("left_panel");
const message_box = document.getElementById("message_box");
const userInfo = JSON.parse(localStorage.getItem("user_info"));



//check on calling function  there is more  explain
//chat with new user 
const letsChat = () => {
  if (localStorage.getItem("letsChat")) {
    getMessage(localStorage.getItem("letsChat"), null);
    localStorage.removeItem("letsChat");
  }
}

//if the user just sends a message page will reload this function is used to re enter us to the receiver page chat by getting his id from local storage
const checkLiveMessage = () => {
  if (localStorage.getItem("message_user")) {
    getMessage(localStorage.getItem("message_user"), null);
    localStorage.removeItem("message_user");
  }
}

//send message
const sendMessage = async (id, text) => {
  const data = new FormData()
  data.append("token", dating_website.token);
  data.append("text", text);
  data.append("receiver_id", id);
  const url = `${dating_website.baseUrl}/message`;
  const res = await dating_website.postAPI(url, data);
  if (res.data.status == "Success") {
    location.reload();
    localStorage.setItem("message_user", id)
  }
}


// add event on send btn
const sendBtn = (id) => {
  const btn = document.getElementById("send");
  const text = document.getElementById("text");
  btn.addEventListener("click", () => {
    if (text.value != "") {
      text.classList.remove("danger");
      sendMessage(id, text.value);

    } else {
      text.classList.add("danger");
    }

  })

}

//add color to name of current user chat
const removeSelected = () => {
  const selected = document.querySelectorAll(".selected");
  selected.forEach(element => {
    element.classList.remove("selected");

  });

}

//when click on any user name the chat history will loaded
//data is the messages id is the user_receiver id
const loadMessage = (data, id) => {
  message_box.innerHTML = ""
  if (data.status == "Success") {

    data.data.forEach(element => {
      const d = new Date(element.date * 1000);
      console.log(element)
      if (element.sender_id == userInfo.id) {
        message_box.innerHTML += `
        <div class="send">
          <div class="date"><span>${d.toDateString()}</span></div>
          <div class="text"><span>${element.text}</span></div>
        </div>`;

      } else {
        message_box.innerHTML += `
        <div class="received">
          <div class="date"><span>${d.toDateString()}</span></div>
          <div class="text"><span>${element.text}</span></div>
        </div>
        `;
      }


    });
    message_box.innerHTML += `
    <div class="new-message">
    <input type="text" placeholder="Enter message" class="input" id="text">
    <button class="send-message" id="send"  >Send!</button>
    </div>`
    // add event on send btn
    sendBtn(id);

  }

}


//get the message history from database for this id
const getMessage = async (id, element = null) => {
  removeSelected()
  if (element) {
    element.classList.add("selected");
  }
  const url = `${dating_website.baseUrl}/messages/${id}?token=${dating_website.token}`
  const res = await dating_website.getAPI(url);
  loadMessage(res.data, id)
}


// add event to each user to see the chat when click on his name the chat history will loaded
const loadEvent = () => {
  const user_receiver = document.querySelectorAll(".user_receiver");
  user_receiver.forEach(element => {
    element.addEventListener("click", async () => {
      getMessage(element.getAttribute("data-value"), element);
    });
  });

  const user_senders = document.querySelectorAll(".user_senders");
  user_senders.forEach(element => {
    element.addEventListener("click", async () => {
      getMessage(element.getAttribute("data-value"), element);
    });
  });

}

// load all users who texted the current login user or current user text them
// print their name on page
const loadData = (data) => {
  //we have senders and receivers as we may send to  a user but never reply back or vice versa and we need the user name in the 2 condition  
  //but we may reply back so some users may be duplicated as senders and receivers so remove them by data.receivers.splice(**) if exists
  let senders = data.senders
  let receivers = data.receivers
  for (let j = 0; j < receivers.length; j++) {
    for (let k = 0; k < senders.length; k++) {
      if (senders[k].user_sender.id == receivers[j].user_receiver.id)
        receivers.splice(j, 1);
    }
  }

  if (receivers.length != 0 || receivers.length != 0) {
    left_panel.innerHTML = "";
  }
  senders.forEach((element) => {

    left_panel.innerHTML += ` 
    <div class="user user_senders " data-value="${element.user_sender.id}">
     <div class="img">
       <img src="assets/client.png" alt="img">
     </div>
     <span>${element.user_sender.name}</span>
    </div>`;

  });
  receivers.forEach(element => {
    left_panel.innerHTML += ` 
    <div class="user user_receiver" data-value="${element.user_receiver.id}" >
     <div class="img">
       <img src="assets/client.png" alt="img">
     </div>
     <span>${element.user_receiver.name}</span>
    </div>`;
  });
  // add event to each user to see chat when click on his name the chat history will loaded
  loadEvent()



}

//get info of all user who text them 
//geting there name then laod them on page
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

//if the user just sends a message page will reload this function is used to re enter the receiver page by getting his id from local storage
checkLiveMessage();

//when redirecting from any page to chat page and adding user id in local storage will open like a new tab I chat with this user
//this function will check if there is an id local storage under a specific name 
letsChat();