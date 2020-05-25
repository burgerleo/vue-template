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
        getIpLocation: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.get("ip-location", {
                params: data
            }).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        updateIpLocation: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.patch("ip-location/" + data.min, data).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
    }
}