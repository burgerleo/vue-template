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
        getLog: (context, data) => {
            axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL3;

            return axios.get("log/cdn-change", { params: data }).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
    }
}