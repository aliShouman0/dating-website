const dating_website = {};

dating_website.baseUrl = "http://127.0.0.1:8000/api/v0.1"


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
  const api_logout = `${dating_website.baseUrl}/logout`
  const token = localStorage.getItem("access_token");
  const data = new FormData();
  data.append("token", token)

  logout_btn.addEventListener("click", async () => {
    await dating_website.postAPI(api_logout, data);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    location.reload();

  })
}