import axios from "axios";

let baseApi = axios.create({
  //baseURL: "https://qwiz-go-api.herokuapp.com",
  baseURL: process.env.MYBASE_URL || 'https://qwiz-go-api.herokuapp.com'
});

let Api = function () {
  let token = localStorage.getItem("token");
  baseApi.defaults.headers.common["Accept"] = "*/*";
  if (token) {
    baseApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return baseApi;
};

export default Api;
