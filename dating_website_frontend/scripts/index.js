// const workshop_pages = {};

// workshop_pages.baseUrl = "http://127.0.0.1:8000/api/v0.1"


// workshop_pages.Console = (title, values, oneValue = true) => {
//   console.log('___' + title + '___');
//   if (oneValue) {
//     console.log(values);
//   } else {
//     for (let i = 0; i < values.length; i++) {
//       console.log(values[i]);
//     }
//   }
//   console.log('___/' + title + '___');

// }

// workshop_pages.getAPI = async (api_url) => {
//   try {
//     return await axios(api_url);
//   } catch (error) {
//     console.log(error);
//   }
// }

// workshop_pages.postAPI = async (api_url, api_data, api_token) => {
//   try {
//     return await axios.post(api_url, api_data, {
//       headers: {
//         "Authorization": "token" + api_token
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// workshop_pages.loadFor = (page) => {
//   eval("workshop_pages.load_" + page + "();");
// }


// workshop_pages.load_landing = async () => {
 
//   const id = "2";
//   const products_url = `${workshop_pages.baseUrl}/stores`;
//   const respose_porduct = await workshop_pages.getAPI(products_url);
//   workshop_pages.Console("Testing Products API", respose_porduct.data.data);

// } 

// workshop_pages.load_sigup = () => {}

 