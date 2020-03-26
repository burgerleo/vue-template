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
      return axios.get("edges").then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    getCustomerInfo: (context, data) => {
      return axios.get("customers").then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    createEdge: (context, data) => {
      return axios.post("edges", data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    updateEdge: (context, data) => {
      return axios.patch("edges/" + data.id, data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    destroyEdge: (context, data) => {
      return axios.delete("edges/" + data.id, data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    }

  }
}