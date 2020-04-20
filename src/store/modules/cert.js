import axios from "../../utils/axios";

export default {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {

  },
  actions: {
    getList: () => {
      return axios.get("certs").then(function(response) {
        return Promise.resolve(response.data);
      })
        .catch(function(error) {
          return Promise.reject(error.response.data);
        });
    },
    download: (context, data) => {
      return axios.post("certs", data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
  }
}