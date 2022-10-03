//tags
const main = document.getElementById("main");
const userInfo = JSON.parse(localStorage.getItem("user_info"));
const token = localStorage.getItem("access_token");





const blockUser = async (btn) => {
  const url = dating_website.baseUrl + "/block"
  const data = new FormData();
  data.append("token", token);
  data.append("user_id", userInfo["id"]);
  data.append("blocked_user_id", btn.getAttribute("value"));
  const res = await dating_website.postAPI(url, data);
  location.reload();

}


const loadEvents = () => {
  // get all btn and add addEventListener 
  const block = document.querySelectorAll(".block");
  block.forEach(element => {
    element.addEventListener("click", () => {
      blockUser(element);
    })
  });
}

// load interested user on screen as card
const loadUser = (data) => {
  data.forEach(element => {
    main.innerHTML += ` 
    <div class="card">
    <div class="card-header">
      <img src="${element.picture?"../dating_website_backend/storage/app/"+element.picture:"assets/client.png"}" alt="img">
    </div>
    <div class="card-body">
      <p>Name:<span>${element.name}</span></p>
      <p>Bio:<span>${element.bio}</span></p>
      <p>Age:<span>${element.age}</span></p>
      <p>Locaton:<span>${element.location}</span></p>
    </div>
    <div class="card-footer">
      <button class="card-btn chat "   value="${element.id}">Chat</button>
      <button class="card-btn block"   value="${element.id}">Block</button>
      <div class="like" id="like_btn"><img src="assets/heart.png" alt="like" value="${element.id}"></div>
    </div>
  </div> `;

  });
  // load events for like block and chat
  loadEvents();
}

// get interested user
const get_user = async () => {
  const url = `${dating_website.baseUrl}/interested_in/${userInfo["id"]}/${userInfo["interested_in"]}?token=${token}`;
  const intersted_user = await dating_website.getAPI(url);
  if (intersted_user.status && intersted_user.status == 200 && intersted_user.data.status == "Success") {
    loadUser(intersted_user.data.data);
  } else {
    main.innerHTML += ` Some Thing is Wrong 😒😢🥲🤨😥`;
  }
}

// check if login by checking data in  localStorage
checkLogin = async () => {
  if (!localStorage.getItem("access_token")) {
    localStorage.removeItem("user_info");
  }
  const access_token = localStorage.getItem("access_token");
  // get user info
  const user_info_url = `${dating_website.baseUrl}/me`;
  let api_userInfo = new FormData();
  api_userInfo.append("token", access_token);
  const user_info = await dating_website.postAPI(user_info_url, api_userInfo);
  if (user_info.status && user_info.status == 200) {
    localStorage.setItem("user_info", JSON.stringify(user_info.data));
    return true;
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    window.location = "login.html";
  }
}


checkLogin();


dating_website.logout();
get_user();