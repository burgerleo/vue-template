import axios from "../../utils/axios";

export default {
    namespaced: true,
    state: {
        bgpList: {
            HK: [],
            TW: [],
            PH: []
        },
        bgpListPartition: {
            HK: {
                C: [],
                G: []
            },
            TW: {
                C: [],
                G: []
            },
            PH: []
        },
    },
    getters: {
        bgpList: state => () => {
            var bgplist = JSON.parse(localStorage.getItem("bgpList"));

            return bgplist ? bgplist : state.bgpList;
        },
        bgpListPartition: state => () => {
            var bgplist = JSON.parse(localStorage.getItem("bgpListPartition"));

            return bgplist ? bgplist : state.bgpListPartition;
        },
    },
    mutations: {
        updateBGPList: (state, bgpList) => {
            state.bgpList = Object.assign({}, bgpList);
            localStorage.setItem("bgpList", JSON.stringify(bgpList));
        },
        updateBGPListPartition: (state, bgpList) => {
            state.bgpListPartition = Object.assign({}, bgpList);
            localStorage.setItem("bgpListPartition", JSON.stringify(bgpList));
        }
    },
    actions: {
        bgpListReorder: (context, items) => {
            var newItems = {}

            const itemsKeyList = Object.keys(items)

            itemsKeyList.map(function (sites) {
                items[sites].map(function (bgp) {
                    var type = bgp.substr(-1)

                    if (!newItems[sites]) {
                        newItems[sites] = {
                            C: [],
                            G: []
                        }
                    }

                    newItems[sites][type].push(bgp)
                    newItems[sites][type].sort(function (a, b) {
                        return a.indexOf('R2') >= 0 ? 1 : -1
                    });
                })
            })

            itemsKeyList.map(function (sites) {
                items[sites] = [].concat(
                    newItems[sites]['C'],
                    newItems[sites]['G']
                )
            })

            context.commit("updateBGPList", items)
            context.commit("updateBGPListPartition", newItems)
        },
        getInfo: (context, data) => {
            return axios.get("bgp_io_mapping").then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        createDummy: (context, data) => {
            return axios.post("bgp_io_mapping", data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        updateDummy: (context, data) => {
            return axios.put("bgp_io_mapping/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        },
        destroyDummy: (context, data) => {
            return axios.delete("bgp_io_mapping/" + data.id, data).then(function (response) {
                return Promise.resolve(response.data);
            })
                .catch(function (error) {
                    return Promise.reject(error.response.data);
                });
        }

    }
}