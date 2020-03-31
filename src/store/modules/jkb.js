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
        getConfig: (context, data) => {
            return axios.get("jkb/config/" + data.page, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        setConfig: (context, data) => {
            return axios.post("jkb/config/" + data.page, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
    }
}