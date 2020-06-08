<template lang="pug">
    v-navigation-drawer(v-model="drawer" :clipped="clipped" fixed app :tabId="tabId")
        v-list(dense subheader)
            template(v-for="item, index in items" )
                v-subheader(v-if="item.header") {{item.header}}
                v-list-item(v-if="!item.items && item.icon" :to="item.router")
                    v-list-item-icon
                        v-icon {{item.icon}}
                    v-list-item-content
                        v-list-item-title(v-text="item.title")
                v-list-group(v-if="item.items" v-for="item in [items[index]]" :key="item.title" v-model="item.active" :prepend-icon="item.icon" no-action)
                    template(v-slot:activator)
                        v-list-item-content
                            v-list-item-title(v-text="item.title")
                    v-list-item.pl-8(v-for="subItem in item.items" :key="subItem.title" :to="subItem.router")
                        v-list-item-icon
                            v-icon {{subItem.icon}}
                        v-list-item-content
                            v-list-item-title(v-text="subItem.title")
</template>
<script>
export default {
    props: {
        tabId: {
            type: Number
        }
    },
    components: {},
    data() {
        return {
            drawer: true,
            mini: false,
            clipped: true,
            tabItems: [],
            items: [
                // * monitoring
                // * Lookup
                // * Test & Analyze
                // * Reports
                // * --------------
                // * Management
                // * Administrator
                {
                    header: 'General'
                },
                {
                    icon: 'mdi-magnify',
                    title: 'Lookup',
                    active: false,
                    items: [
                        {
                            title: 'Dig',
                            icon: 'mdi-ethernet-cable',
                            router: '/dig'
                        },
                        {
                            title: 'IP Location',
                            icon: 'mdi-access-point',
                            router: '/ip2location'
                        }
                    ]
                },
                {
                    icon: 'mdi-test-tube',
                    title: 'Test & Analyze',
                    active: false,
                    items: [
                        {
                            title: 'Curl & F12',
                            icon: 'mdi-check',
                            router: '/curl'
                        },
                        {
                            title: 'Ping',
                            icon: 'mdi-pin',
                            router: '/ping'
                        },
                        {
                            title: 'Ping Realtime',
                            icon: 'mdi-lan-pending',
                            router: '/ping-realtime'
                        },
                        {
                            title: 'Test All Circuits',
                            icon: 'mdi-vector-circle',
                            router: '/test-all-circuits'
                        },
                        {
                            title: 'Traceroute',
                            icon: 'mdi-file-tree',
                            router: '/traceroute'
                        },
                        {
                            title: 'MTR',
                            icon: 'mdi-sitemap',
                            router: '/mtr'
                        }
                    ]
                },
                {
                    title: 'Monitoring',
                    icon: 'mdi-monitor',
                    active: false,
                    items: [
                        {
                            title: 'JKB Availability',
                            icon: 'mdi-lumx',
                            router: '/jkb-packetloss'
                        },
                        {
                            title: 'JKB Latency',
                            icon: 'mdi-looks',
                            router: '/jkb-Latency'
                        }
                    ]
                },
                {
                    title: 'Reports',
                    icon: 'mdi-file'
                },
                {
                    // header: 'Administrator',
                },
                {
                    icon: 'mdi-human-greeting',
                    title: 'Management',
                    active: false,
                    items: [
                        {
                            title: 'Cert Management',
                            icon: 'mdi-format-align-justify',
                            router: '/crt-key'
                        },
                        {
                            title: 'FQDN Management',
                            icon: 'mdi-content-paste',
                            router: '/domain-manage'
                        }
                    ]
                },
                {
                    icon: 'mdi-account',
                    title: 'Administrator',
                    active: false,
                    items: [
                        {
                            title: 'BGP Peer',
                            icon: 'mdi-call-made',
                            router: '/bgp'
                        },
                        {
                            title: 'Dummy IP Combination',
                            icon: 'mdi-forward',
                            router: '/dummy-ip'
                        },
                        {
                            title: 'Edge',
                            icon: 'mdi-comment-check',
                            router: '/edge'
                        },
                        {
                            title: 'Customer',
                            icon: 'mdi-human-male-female',
                            router: '/customer'
                        },
                        {
                            title: 'Package IP Mapping',
                            icon: 'mdi-chart-histogram',
                            router: '/dns-records'
                        }
                    ]
                }
            ],
            admins: [
                ['Management', 'mdi-people-outline'],
                ['Settings', 'mdi-settings']
            ]
        }
    },
    watch: {
        // tabId() {
        //     this.navigationControl()
        // }
    },
    methods: {
        // navigationControl() {
        //     this.items.forEach(o => {
        //         if (o.id == this.tabId) {
        //             this.tabItems = o.menu
        //         }
        //     })
        // }
    },
    created() {
        // this.navigationControl()
    }
}
</script>

