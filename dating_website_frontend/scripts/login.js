// tags
const signup_section = document.getElementById("signup_section");
const new_account = document.getElementById("new_account");
const close = document.getElementById("close");
const login_btn = document.getElementById("login_btn");
const login_password = document.getElementById("login_password");
const login_email = document.getElementById("login_email");
const error = document.getElementById("error");
const signup_name = document.getElementById("signup_name");
const signup_email = document.getElementById("signup_email");
const signup_age = document.getElementById("signup_age");
const signup_password = document.getElementById("signup_password");
const signup_location = document.getElementById("signup_location");
const signup_bio = document.getElementById("signup_bio");
const gender = document.getElementById("gender");
const intersted_in = document.getElementById("intersted_in");
const signup_btn = document.getElementById("signup_btn");









// check if all input are filled
const checkinput = (type) => {
  login_email.classList.remove("danger");
  login_password.classList.remove("danger");
  signup_name.classList.remove("danger");
  signup_email.classList.remove("danger");
  signup_age.classList.remove("danger");
  signup_password.classList.remove("danger");
  signup_bio.classList.remove("danger");
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

    if (signup_email.value == "") {
      signup_email.classList.add("danger");
      return false;
    }
    if (signup_password.value == "") {
      signup_password.classList.add("danger");
      return false;
    }

    if (signup_password.value == "") {
      signup_age.classList.add("danger");
      return false;
    }
    if (signup_location.value == "") {
      signup_password.classList.add("danger");
      return false;
    }
    if (signup_biosignup_btn.value == "") {
      signup_password.classList.add("danger");
      return false;
    }

  }
  return true;

}

// check if login by test data in  localStorage
const checkLogin = async () => {
  const access_token = localStorage.getItem("access_token");
  // get user info
  const user_info_url = `${dating_website.baseUrl}/me`;
  let api_userInfo = new FormData();
  api_userInfo.append("token", access_token);
  const user_info = await dating_website.postAPI(user_info_url, api_userInfo);
  if (user_info.status && user_info.status == 200) {
    localStorage.setItem("user_info", JSON.stringify(user_info.data));
    window.location = "home.html"

  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");

  }
}


// start login method
const login = async () => {
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
      }

    } else {
      error.classList.remove("d-none");

    }
  }

}

// end login method


// start creating new account
const signup = async () => {
  if (checkinput("signup")) {
    // start login method
    let api_data = new FormData();
    api_data.append("email", login_email.value);
    api_data.append("password", login_password.value);
    const login_url = `${dating_website.baseUrl}/login`;
    const login_info = await dating_website.postAPI(login_url, api_data);

    if (login_info.status && login_info.status == 200) {}
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
signup_btn.addEventListener("click", signup)


//check if user already logged in
checkLogin();