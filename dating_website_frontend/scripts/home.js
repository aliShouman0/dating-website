//tags
const main = document.getElementById("main");
const userInfo = JSON.parse(localStorage.getItem("user_info"));
const token = localStorage.getItem("access_token");


// load interested user on screen as card
const loadUser = (data) => {
  dating_website.Console("s", data)
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
      <button class="card-btn" id="chat_btn" value="${element.id}">Chat</button>
      <button class="card-btn" id="bock_btn" value="${element.id}">Block</button>
      <div class="like" id="like_btn"><img src="assets/heart.png" alt="like" value="${element.id}"></div>
    </div>
  </div> `;

  });
}

// get interested user
const get_user = async () => {
  const url = `${dating_website.baseUrl}/interested_in/${userInfo["id"]}/${userInfo["interested_in"]}?token=${token}`;
  const intersted_user = await dating_website.getAPI(url);
  if (intersted_user.status && intersted_user.status == 200 && intersted_user.data.status == "Success") {
    loadUser(intersted_user.data.data);
  }else{
    main.innerHTML += ` Some Thing is Wrong 😒😢🥲🤨😥`;
  }
}

get_user();