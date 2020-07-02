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
        getCountry: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.get("country").then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        getCountryByGEC: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.get("country/gec").then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        updateCountry: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.patch("country/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        getProvince: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.get("province").then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        getCity: (context, data = {}) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL2;

            return axios.get("city").then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
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