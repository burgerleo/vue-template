<template lang="pug">
    v-navigation-drawer(v-model="drawer" :clipped="clipped" fixed app)
        v-text-field.px-2.pt-0(v-model="searchMenu" label="Search Menu" single-line hide-details dense append-icon="mdi-magnify" @input="filterMenu")
        v-tabs.mx-0.px-0(v-model="tabId" v-if="!searchMenu" align-with-title dense grow)
            v-tab.ml-0.px-0(v-for="tab in tabs") {{tab}} 
        v-list(dense subheader)
            template(v-for="item, index in items" v-if="(item.tabId == tabId) || searchMenu")
                v-subheader(v-if="item.header && !searchMenu") {{item.header}}
                v-list-item(v-if="(!item.items && item.icon) && item.display" :to="item.router")
                    v-list-item-icon
                        v-icon {{item.icon}}
                    v-list-item-content
                        v-list-item-title(v-text="item.title")
                v-list-group(v-if="item.items && item.display" v-for="item in [items[index]]" :key="item.title" v-model="item.active" :prepend-icon="item.icon" no-action)
                    template(v-slot:activator)
                        v-list-item-content
                            v-list-item-title(v-text="item.title")
                    v-list-item.pl-8(v-for="subItem in item.items" v-if="subItem.display" :key="subItem.title" :to="subItem.router")
                        v-list-item-icon
                            v-icon {{subItem.icon}}
                        v-list-item-content
                            v-list-item-title(v-text="subItem.title")
</template>
<script>
export default {
    props: {},
    components: {},
    data() {
        return {
            drawer: true, // menu open or closs
            clipped: true,
            searchMenu: '',
            tabId: 0,
            tabs: ['G', 'A'],
            items: [
                {
                    tabId: 0,
                    header: 'General'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'Lookup',
                    display: true,
                    active: false,
                    items: [
                        {
                            icon: 'mdi-ethernet-cable',
                            title: 'Dig',
                            display: true,
                            router: '/dig'
                        },
                        {
                            icon: 'mdi-access-point',
                            title: 'IP Location',
                            display: true,
                            router: '/ip2location'
                        }
                    ]
                },
                {
                    tabId: 0,
                    icon: 'mdi-test-tube',
                    title: 'Test & Analyze',
                    display: true,
                    active: false,
                    items: [
                        {
                            icon: 'mdi-check',
                            title: 'Curl & F12',
                            display: true,
                            router: '/curl'
                        },
                        {
                            icon: 'mdi-pin',
                            title: 'Ping',
                            display: true,
                            router: '/ping'
                        },
                        {
                            icon: 'mdi-lan-pending',
                            title: 'Ping Realtime',
                            display: true,
                            router: '/ping-realtime'
                        },
                        {
                            icon: 'mdi-vector-circle',
                            title: 'Test All Circuits',
                            display: true,
                            router: '/test-all-circuits'
                        },
                        {
                            icon: 'mdi-file-tree',
                            title: 'Traceroute',
                            display: true,
                            router: '/traceroute'
                        },
                        {
                            icon: 'mdi-sitemap',
                            title: 'MTR',
                            display: true,
                            router: '/mtr'
                        }
                    ]
                },
                {
                    tabId: 0,
                    icon: 'mdi-monitor',
                    title: 'Monitoring',
                    display: true,
                    active: false,
                    items: [
                        {
                            icon: 'mdi-lumx',
                            title: 'JKB Availability',
                            display: true,
                            router: '/jkb-availability'
                        },
                        {
                            icon: 'mdi-looks',
                            title: 'JKB Latency',
                            display: true,
                            router: '/jkb-Latency'
                        },
                        {
                            icon: 'mdi-gesture',
                            title: 'Dummy Packet Loss',
                            display: true,
                            router: '/dummy-packet-loss'
                        },
                        {
                            icon: 'mdi-gauge',
                            title: 'Dummy RTT',
                            display: true,
                            router: '/dummy-rtt'
                        },
                        {
                            icon: 'mdi-nfc-tap',
                            title: 'FQDN Change',
                            display: true,
                            router: '/fqdnChange'
                        }
                    ]
                },
                {
                    tabId: 0,
                    icon: 'mdi-file',
                    title: 'Reports',
                    display: true,
                    router: '/reports'
                },
                {
                    tabId: 0,
                    icon: 'mdi-human-greeting',
                    title: 'Management',
                    display: true,
                    active: false,
                    items: [
                        {
                            icon: 'mdi-format-align-justify',
                            title: 'Cert Management',
                            display: true,
                            router: '/crt-key'
                        },
                        {
                            icon: 'mdi-chart-histogram',
                            title: 'Package IP Mapping',
                            display: true,
                            router: '/dns-records'
                        }
                    ]
                },
                {
                    tabId: 0,
                    icon: 'mdi-account',
                    title: 'Configuration MGT',
                    display: true,
                    active: false,
                    items: [
                        {
                            title: 'BGP Peer',
                            icon: 'mdi-call-made',
                            display: true,
                            router: '/bgp'
                        },
                        {
                            icon: 'mdi-forward',
                            title: 'Dummy IP Combination',
                            display: true,
                            router: '/dummy-ip'
                        },
                        {
                            icon: 'mdi-comment-check',
                            title: 'Edge',
                            display: true,
                            router: '/edge'
                        },
                        {
                            icon: 'mdi-human-male-female',
                            title: 'Customer',
                            display: true,
                            router: '/customer'
                        },
                        {
                            icon: 'mdi-content-paste',
                            title: 'FQDN Management',
                            display: true,
                            router: '/domain-manage'
                        },
                        {
                            icon: 'mdi-white-balance-sunny',
                            title: 'H7 IP Prefix',
                            display: true,
                            router: '/h7-ip'
                        },
                        {
                            icon: 'mdi-blur-linear',
                            title: 'Critical Public IP',
                            display: true,
                            router: '/cpip'
                        }
                    ]
                },
                {
                    tabId: 1,
                    header: 'Platform Administrator'
                },
                {
                    tabId: 1,
                    icon: 'mdi-account',
                    title: 'Administrator',
                    display: true
                    // router: '/administrator'
                }
            ]
        }
    },
    watch: {},
    methods: {
        filterMenu() {
            var searchText = this.searchMenu
                .trim()
                .toString()
                .toLocaleUpperCase()

            this.items.map(function(items) {
                if (items.items) {
                    var hasMappingOne = false // subItem have mapping ?
                    items.items.map(function(subItem) {
                        var subItemTitle = subItem.title
                            ? subItem.title.toString().toLocaleUpperCase()
                            : ''

                        // Check Mapping
                        var bool =
                            subItemTitle.indexOf(searchText) !== -1
                                ? true
                                : false

                        subItem.display = bool
                        hasMappingOne = hasMappingOne ? hasMappingOne : bool
                    })

                    items.display = hasMappingOne

                    // 如果 searchText 有輸入值，使用hasMappingOne
                    items.active = searchText ? hasMappingOne : false
                } else {
                    // 第一階層的 Menu
                    var title = items.title
                        ? items.title.toString().toLocaleUpperCase()
                        : ''
                    // Check Mapping
                    items.display =
                        title.indexOf(searchText) !== -1 ? true : false
                }
            })
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.v-tabs {
    .v-tab {
        min-width: 30px;
        // max-width: 30px;
    }
}
</style>
