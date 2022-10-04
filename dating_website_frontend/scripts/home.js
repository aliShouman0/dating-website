//tags
const main = document.getElementById("main");
const edit = document.getElementById("edit");
const error2 = document.getElementById("error2");
const edit_name = document.getElementById("edit_name");
const edit_email = document.getElementById("edit_email");
const edit_age = document.getElementById("edit_age");
const edit_password = document.getElementById("edit_password");
const edit_location = document.getElementById("edit_location");
const edit_bio = document.getElementById("edit_bio");
const gender_male = document.getElementById("gender_male");
const gender_female = document.getElementById("gender_female");
const interested_female = document.getElementById("interested_female");
const interested_male = document.getElementById("interested_male");
const picture = document.getElementById("picture");
const edit_btn = document.getElementById("edit_btn");
const profile_pic = document.getElementById("profile_pic");
const close = document.getElementById("close");
const body = document.querySelector("body");
const invisible = document.getElementById("invisible");

const save = document.getElementById("save");

const edit_section = document.getElementById("edit_section");


const userInfo = JSON.parse(localStorage.getItem("user_info"));




// check if all input are filled
const checkinput = () => {
  edit_name.classList.remove("danger");
  edit_email.classList.remove("danger");
  edit_age.classList.remove("danger");
  edit_password.classList.remove("danger");
  edit_bio.classList.remove("danger");
  edit_location.classList.remove("danger");
  if (edit_name.value == "") {
    edit_name.classList.add("danger");
    return false;
  }
  const regEx = /[a-z0-9_\.-]{1,}@[a-z0-9_\.-]{1,}.com/;

  if (edit_email.value == "" || !regEx.test(edit_email.value)) {
    edit_email.classList.add("danger");
    return false;
  }
  if (edit_age.value == "") {
    edit_age.classList.add("danger");
    return false;
  }
  if (edit_location.value == "") {
    edit_location.classList.add("danger");
    return false;
  }
  if (edit_bio.value == "") {
    edit_bio.classList.add("danger");
    return false;
  }
  return true;
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

//send data after load from user to edit profile
const sendData = async () => {
  const edit_url = `${dating_website.baseUrl}/edit`;
  const edit_info = await dating_website.postAPI(edit_url, api_edit_data);
  if (edit_info.status && edit_info.status == 200) {
    location.reload();
  } else {
    error2.classList.remove("d-none");
  }
  dating_website.Console("post", edit_info);
}

const fillFrom = () => {
  edit_name.value = userInfo.name;
  edit_email.value = userInfo.email;
  edit_age.value = userInfo.age;
  edit_location.value = userInfo.location;
  edit_bio.value = userInfo.bio;
  gender_male.checked = userInfo.gender == "male" ? true : false;
  interested_male.checked = userInfo.interested_in == "male" ? true : false;
  gender_female.checked = userInfo.gender == "female" ? true : false;
  interested_female.checked = userInfo.interested_in == "female" ? true : false;
  profile_pic.src = `${userInfo.picture?"../dating_website_backend/storage/app/"+userInfo.picture:"assets/client.png"}`

}

const data = new FormData();

// load and check if data is valid for edit
const loadData = () => {
  error2.classList.add("d-none");
  if (checkinput()) {
    // edit method
    data.append("token", dating_website.token);
    data.append("name", edit_name.value);
    data.append("email", edit_email.value);
    data.append("age", edit_age.value);
    if (edit_password.value != "") {
      data.append("password", edit_password.value);
    }
    data.append("location", edit_location.value);
    data.append("bio", edit_bio.value);
    data.append("invisible", invisible.value);
    data.append("invisible", "0");
    data.append("interested_in", interested_male.checked ? interested_male.value : "female");
    data.append("gender", gender_male.checked ? gender_male.value : "female");
    sendData();

    console.log("s")

  }
}



save.addEventListener("click", loadData);

// popup for edit account
edit.addEventListener("click", () => {
  edit_section.classList.remove("d-none");
  body.classList.add("overflow");
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  // fill form in his own data
  fillFrom();
})

close.addEventListener("click", () => {
  edit_section.classList.add("d-none");
  body.classList.remove("overflow");

})


// check if login by checking data in  localStorage
// check if user are login in and chck if token are valid
dating_website.checkLogin();


dating_website.logout();
// get interested user
get_user();