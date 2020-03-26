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
    getCurlInfo: (context, data) => {
      return axios.post("curl", data).then(function(response) {
        return Promise.resolve(response.data);
      })
        .catch(function(error) {
          return Promise.reject(error.response.data);
        });
    },
    getDomainList: (context, data) => {
      return axios.post("curl/domain-list", data).then(function(response) {
        return Promise.resolve(response.data.data);
      })
        .catch(function(error) {
          return Promise.reject(error.response.data);
        });
    }
  }
}