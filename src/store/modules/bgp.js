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
            return axios.get("bgp_peers").then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        createBGP: (context, data) => {
            return axios.post("bgp_peers", data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        updateBGP: (context, data) => {
            return axios.put("bgp_peers/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        destroyBGP: (context, data) => {
            return axios.delete("bgp_peers/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        }

    }
}