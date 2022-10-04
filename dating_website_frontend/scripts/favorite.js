const main = document.getElementById("main");



// load interested user on screen as card
const loadUser = (data) => {
  data.forEach(element => {
    main.innerHTML += ` 
    <div class="card">
    <div class="card-header">
      <img src="${element.user.picture?"../dating_website_backend/storage/app/"+element.picture:"assets/client.png"}" alt="img">
    </div>
    <div class="card-body">
      <p>Name:<span>${element.user.name}</span></p>
      <p>Bio:<span>${element.user.bio}</span></p>
      <p>Age:<span>${element.user.age}</span></p>
      <p>Locaton:<span>${element.user.location}</span></p>
    </div>
    <div class="card-footer">
      <button class="card-btn chat "   value="${element.user.id}">Chat</button>
      <button class="card-btn block"   value="${element.user.id}">Block</button>
      <!--   <div class="like"  data-value="${element.user.id}" >
       <img src="assets/dislike.png" alt="like"></div>
     </div> -->
  </div> `;

  });
  // load events for like block and chat
  dating_website.loadEvents();
}

// get favorites user
const get_favorites_user = async () => {
  const url = `${dating_website.baseUrl}/favorites?token=${dating_website.token}`;
  const favorites_user = await dating_website.getAPI(url);
  if (favorites_user.status && favorites_user.status == 200 && favorites_user.data.status == "Success") {
    loadUser(favorites_user.data.data);
  } else {
    main.innerHTML += ` Some Thing is Wrong 😒😢🥲🤨😥`;
  }
}




// check if login by checking data in  localStorage
// check if user are login in and chck if token are valid
dating_website.checkLogin();

//add event fo logout
dating_website.logout();

// get favorites user
get_favorites_user();