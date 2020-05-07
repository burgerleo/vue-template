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
        getDigInfo: (context, data) => {
            return axios.get("dummy/dig", {params: data}).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        }
    }
}