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
    getHelperInfo: (context, data) => {
      return axios.post("helper/"+ data.path, {path:data.path, name:data.title}).then(function(response) {
        return Promise.resolve(response.data);
      })
        .catch(function(error) {
          return Promise.reject(error.response.data);
        });
    },
    setContent: (context, data) => {
      return axios.patch("helper", {path:data.path, content:data.content}).then(function(response) {
        return Promise.resolve(response.data);
      })
        .catch(function(error) {
          return Promise.reject(error.response.data);
        });
    }
  }
}