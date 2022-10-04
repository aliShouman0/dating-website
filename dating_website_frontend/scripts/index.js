const dating_website = {};

dating_website.baseUrl = "http://127.0.0.1:8000/api/v0.1"

dating_website.token = localStorage.getItem("access_token");

dating_website.Console = (title, values, oneValue = true) => {
  console.log('___' + title + '___');
  if (oneValue) {
    console.log(values);
  } else {
    for (let i = 0; i < values.length; i++) {
      console.log(values[i]);
    }
  }
  console.log('___/' + title + '___');

}

dating_website.getAPI = async (api_url) => {
  try {
    return await axios(api_url);
  } catch (error) {
    // console.log(error);
    return error;
  }
}

dating_website.postAPI = async (api_url, api_data, api_token = null) => {
  try {
    return await axios.post(api_url, api_data, {
      headers: {
        "Authorization": "token" + api_token
      }
    });
  } catch (error) {
    //console.log(error);
    return error;

  }
}

dating_website.loadFor = (page) => {
  eval("dating_website.load_" + page + "();");
}


dating_website.logout = () => {
  const logout_btn = document.getElementById("logout");
  const api_logout = `${dating_website.baseUrl}/logout`;
  const data = new FormData();
  data.append("token", dating_website.token)

  logout_btn.addEventListener("click", async () => {
    await dating_website.postAPI(api_logout, data);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    location.reload();

  })
}

// check if login by checking data in  localStorage
// check if user are login in and chck if token are valid

dating_website.checkLogin = async () => {
  if (!localStorage.getItem("access_token")) {
    localStorage.removeItem("user_info");
    window.location = "login.html";

  }
  // get user info
  const user_info_url = `${dating_website.baseUrl}/me`;
  const api_userInfo = new FormData();
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

// like user
dating_website.likeUser = async (btn) => {
  const url = dating_website.baseUrl + "/favor"
  const data = new FormData();
  data.append("token", dating_website.token);
  data.append("favorite_id", btn.getAttribute("data-value"));
  const res = await dating_website.postAPI(url, data);
  const p = document.createElement("span");
  if (res.data.status == "exists") {
    p.innerText = "Already in Fav"

  }
  if (res.data.status == "Success") {
    p.innerText = "Added Done"

  }
  btn.parentElement.appendChild(p);
  setTimeout(() => {
    btn.parentElement.removeChild(btn.parentElement.lastChild)
  }, 3000)

}

// block user
dating_website.blockUser = async (btn) => {
  const url = dating_website.baseUrl + "/block"
  const data = new FormData();
  data.append("token", dating_website.token);
  data.append("blocked_user_id", btn.getAttribute("value"));
  const res = await dating_website.postAPI(url, data);
  location.reload();

}

// add Event Listener when all user are present on screen for like block and chat
dating_website.loadEvents = () => {
  // get block all btn and add addEventListener 
  const block = document.querySelectorAll(".block");
  block.forEach(element => {
    element.addEventListener("click", () => {
      dating_website.blockUser(element);
    })
  });

  // get like all btn and add addEventListener 
  const like = document.querySelectorAll(".like");
  like.forEach(element => {
    element.addEventListener("click", () => {
      dating_website.likeUser(element);
    })
  });
}