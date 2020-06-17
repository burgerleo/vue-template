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
        getPingCsvList: (context, data) => {
            return axios.get("dummy/ping/analysis", data)
            .then(function (response) {
                return Promise.resolve(response.data);
            })
            .catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        makePingAnalysisByPromise: (context, data) => {
            return axios.post("dummy/ping/" + data.route + "/analysis", data)
            .then(function (response) {
                return Promise.resolve(response.data);
            })
            .catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
        downloadPingAnalysis: (context, data) => {
            return axios.get("dummy/ping/" + data.route + "/analysis/" + data.type + "/timestamp/" + data.unix, {
                headers: {
                    'Accept': 'application/csv'
                }
            })
            .then(function (response) {
                // global or china
                let route = data.route == 'G' ? 'global' : 'china'

                //date
                let date = new Date(data.unix * 1000);
                let dateStr = date.getFullYear().toString() + "_" +
                (date.getMonth() + 1).toString() + "_" +
                date.getDate().toString() + "_" +
                date.getHours().toString() + "_" +
                date.getMinutes().toString()
                // + date.getSeconds().toString()

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", route+"_"+data.type+"_"+dateStr+".csv");
                link.click();
            })
            .catch(function (error) {
                console.log(error)
                return Promise.reject(error.response);
            });
        },
    }
}