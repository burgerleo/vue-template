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
            return axios.get("cpips").then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        createCPIP: (context, data) => {
            return axios.post("cpips", data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        updateCPIP: (context, data) => {
            return axios.put("cpips/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        destroyCPIP: (context, data) => {
            return axios.delete("cpips/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },

        getUnreachableCPIPs: (context, data) => {
            return axios.get("traffic_flows_h7/cpips/unreachable").then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },

    }
}