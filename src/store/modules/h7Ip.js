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
    getInfo: (context, data) => {
      return axios.get("h7ips").then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    create: (context, data) => {
      return axios.post("h7ips", data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    update: (context, data) => {
      return axios.patch("h7ips/" + data.id, data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    destroy: (context, data) => {
      return axios.delete("h7ips/" + data.id, data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    }

  }
}