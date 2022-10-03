// tags
const signup_section = document.getElementById("signup_section");
const new_account = document.getElementById("new_account");
const close = document.getElementById("close");
const login_btn = document.getElementById("login_btn");
const login_password = document.getElementById("login_password");
const login_email = document.getElementById("login_email");
const error = document.getElementById("error");
const error2 = document.getElementById("error2");
const signup_name = document.getElementById("signup_name");
const signup_email = document.getElementById("signup_email");
const signup_age = document.getElementById("signup_age");
const signup_password = document.getElementById("signup_password");
const signup_location = document.getElementById("signup_location");
const signup_bio = document.getElementById("signup_bio");
const gender_male = document.getElementById("gender_male");
const interested_male = document.getElementById("interested_male");
const picture = document.getElementById("picture");
const signup_btn = document.getElementById("signup_btn");
const profile_pic = document.getElementById("profile_pic");




// check if all input are filled
const checkinput = (type) => {
  login_email.classList.remove("danger");
  login_password.classList.remove("danger");
  signup_name.classList.remove("danger");
  signup_email.classList.remove("danger");
  signup_age.classList.remove("danger");
  signup_password.classList.remove("danger");
  signup_bio.classList.remove("danger");
  signup_location.classList.remove("danger");

  if (type == "login") {
    if (login_email.value == "") {
      login_email.classList.add("danger");
      return false;
    }
    if (login_password.value == "") {
      login_password.classList.add("danger");
      return false;
    }

  } else {
    if (signup_name.value == "") {
      signup_name.classList.add("danger");
      return false;
    }
    const regEx = /[a-z0-9_\.-]{1,}@[a-z0-9_\.-]{1,}.com/;

    if (signup_email.value == "" || !regEx.test(signup_email.value)) {
      signup_email.classList.add("danger");
      return false;
    }
    if (signup_age.value == "") {
      signup_age.classList.add("danger");
      return false;
    }

    if (signup_password.value == "") {
      signup_password.classList.add("danger");
      return false;
    }
    if (signup_location.value == "") {
      signup_location.classList.add("danger");
      return false;
    }
    if (signup_bio.value == "") {
      signup_bio.classList.add("danger");
      return false;
    }

  }
  return true;

}



// start login method
const login = async () => {
  login.disabled = true;
  error.classList.add("d-none");
  // check  input 
  if (checkinput("login")) {
    // start login method
    let api_data = new FormData();
    api_data.append("email", login_email.value);
    api_data.append("password", login_password.value);
    const login_url = `${dating_website.baseUrl}/login`;
    const login_info = await dating_website.postAPI(login_url, api_data);

    if (login_info.status && login_info.status == 200) {
      // if done save toke and get user info by api
      const access_token = login_info.data.access_token
      localStorage.setItem("access_token", access_token);
      // get user info
      const user_info_url = `${dating_website.baseUrl}/me`;
      // this api need token
      let api_userInfo = new FormData();
      api_userInfo.append("token", access_token);
      const user_info = await dating_website.postAPI(user_info_url, api_userInfo);
      //  if token valid will get user info and save in local storage then redirect to home page   
      if (user_info.status && user_info.status == 200) {
        localStorage.setItem("user_info", JSON.stringify(user_info.data));
        window.location = "home.html"

      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        login.disabled = false;

      }

    } else {
      error.classList.remove("d-none");
      login.disabled = false;

    }
  } else {
    login.disabled = false;
  }

}

// end login method

/* signup_data */
// start creating new account
const api_signup_data = new FormData();
//send data after load from user
const sendData = async () => {
  const signup_url = `${dating_website.baseUrl}/signup`;
  const signup_info = await dating_website.postAPI(signup_url, api_signup_data);
  if (signup_info.status && signup_info.status == 200) {
    location.reload();
  } else {
    error2.classList.remove("d-none");
  }
  dating_website.Console("post", signup_info);
}

// load and check if data is valid
const loadData = () => {
  error2.classList.add("d-none");
  if (checkinput("signup")) {
    // start login method
    api_signup_data.append("name", signup_name.value);
    api_signup_data.append("email", signup_email.value);
    api_signup_data.append("age", signup_age.value);
    api_signup_data.append("password", signup_password.value);
    api_signup_data.append("location", signup_location.value);
    api_signup_data.append("bio", signup_bio.value);
    api_signup_data.append("invisible", "0");
    api_signup_data.append("interested_in", interested_male.checked ? interested_male.value : "female");
    api_signup_data.append("gender", gender_male.checked ? gender_male.value : "female");
    sendData();

  }

}

// load img when upload
const loadImg = (e) => {
  const reader = new FileReader();
  if (picture.files.length != 0) {
    reader.addEventListener("load", () => {
      api_signup_data.append("picture", reader.result);
      profile_pic.src = reader.result

    });
    reader.readAsDataURL(picture.files[0]);
  }
}



// popup for new account
new_account.addEventListener("click", () => {
  signup_section.classList.remove("d-none");
})

close.addEventListener("click", () => {
  signup_section.classList.add("d-none");
})
//
login_btn.addEventListener("click", login);
//
signup_btn.addEventListener("click", loadData)
//if img uploaded convert img to base64 and save it in api_signup_data
picture.addEventListener("change", loadImg)

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
    window.location = "home.html";
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");

  }
}
checkLogin();