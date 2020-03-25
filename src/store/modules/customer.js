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
      return axios.get("customers").then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    createCustomer: (context, data) => {
      return axios.post("customers", data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    updateCustomer: (context, data) => {
      return axios.patch("customers/" + data.id, data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    },
    destroyCustomer: (context, data) => {
      return axios.delete("customers/" + data.id, data).then(function (response) {
        return Promise.resolve(response.data);
      })
        .catch(function (error) {
          return Promise.reject(error.response.data);
        });
    }

  }
}