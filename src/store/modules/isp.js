import axios from "../../utils/axios";

export default {
    namespaced: true,
    state: {
        ispList: [
            'All China'
        ]
    },
    getters: {
        ispList: state => () => {
            var ispList = JSON.parse(localStorage.getItem("ispList"));

            return ispList ? ispList : state.ispList;
        },
    },
    mutations: {
        updateISPList: (state, ispList) => {
            state.ispList = Object.assign({}, ispList);
            localStorage.setItem("ispList", JSON.stringify(ispList));
        },
    },
    actions: {
        getISPList: (context, data) => {
            return axios.get("isp").then(function (response) {
                var data = response.data.data

                var isp = ['All China']

                for (let i = 0; i < 3; i++) {
                    isp[data[i]['id']] = data[i]['name']
                }

                context.commit("updateISPList", isp)

                return Promise.resolve(response.data);
            }).catch(function (error) {
                return Promise.reject(error.response.data);
            });
        },
    }
}