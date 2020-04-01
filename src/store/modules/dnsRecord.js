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
    getDNSRecord: () => {
      return axios.get("dns_records").then(function(response) {
        return Promise.resolve(response.data);
      })
        .catch(function(error) {
          return Promise.reject(error.response.data);
        });
    }
  }
}