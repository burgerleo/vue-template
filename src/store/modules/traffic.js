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
        getTrafficFlow: (context, data) => {
            return axios.get("traffic-flow", {
                params: data
            }).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
    }
}