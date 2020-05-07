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
        getDomains: (context, data) => {
            return axios.get("domains", {
                params: data
            }
            ).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },

        updateDomainIpMapping: (context, data) => {
            return axios.patch("domains/" + data.domain_id + "/ips/" + data.ip_id, data).then(function (response) {
                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
    }
}