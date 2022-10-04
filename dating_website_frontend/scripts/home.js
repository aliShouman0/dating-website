//tags
const main = document.getElementById("main");
const userInfo = JSON.parse(localStorage.getItem("user_info"));


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
      <div class="like"  data-value="${element.id}" ><img src="assets/heart.png" alt="like"></div>
     </div>
  </div> `;

  });
  // load events for like block and chat
  dating_website.loadEvents();
}

// get interested user
const get_user = async () => {
  const url = `${dating_website.baseUrl}/interested_in?token=${dating_website.token}`;
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
    window.location = "login.html";

  }
  // get user info
  const user_info_url = `${dating_website.baseUrl}/me`;
  let api_userInfo = new FormData();
  api_userInfo.append("token", dating_website.token);
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


// check if login by checking data in  localStorage
// check if user are login in and chck if token are valid
dating_website.checkLogin();


dating_website.logout();
// get interested user
get_user();