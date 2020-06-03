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
        getPingInfo: (context, data) => {
            return axios.post("dummy/ping", data)
            .then(function (response) {
                return Promise.resolve(response.data);
            })
            .catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        makeReportPing: (context, data) => {
            return axios.post("dummy/ping/report", data)
            .then(function (response) {
                return Promise.resolve(response.data);
            })
            .catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        downloadReportPing: (context, data) => {
            return axios.get("dummy/ping/report/" + data.type, {
                headers: {
                    'Accept': 'application/csv'
                }
            })
            .then(function (response) {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", data.type+".csv");
                link.click();
            })
            .catch(function (error) {
                console.log(error)
                return Promise.reject(error.response);
            });
        },
    }
}