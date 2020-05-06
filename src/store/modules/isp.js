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
        getISPList: (context, data) => {
            return axios.get("isp").then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
    }
}