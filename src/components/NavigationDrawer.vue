<template lang="pug">
    v-navigation-drawer(v-model="drawer" :clipped="clipped" fixed app :tabId="tabId")
        v-list(dense)
            template(v-for="item in tabItems")
                v-subheader(v-if="item.header") {{item.header}}
                v-list-item-group(v-if="!item.header")
                    v-list-item(link v-if="!item.children" :to="item.router")
                        v-list-item-icon
                            v-icon {{item.icon}}
                        v-list-item-content
                            v-list-item-title {{item.title}}
                    v-list-group(link v-if="item.children")
                        template(v-slot:activator)
                            v-list-item-icon
                                v-icon {{item.icon}}
                            v-list-item-content
                                v-list-item-title {{item.title}}
                        v-list-group(v-if="child.children" no-actions sub-group value="true" v-for="child in item.children")
                            template(v-slot:activator)
                                v-list-item-content
                                    v-list-item-title {{child.title}}
                            v-list-item(v-for="i in child.children" :key="i.id" link v-if="child.children")
                                v-list-item-icon
                                    v-icon {{i.icon}}
                                v-list-item-content
                                    v-list-item-title {{i.title}}



</template>
<script>
export default {
    props: {
        tabId: {
            type: Number
        }
    },
    data() {
        return {
            kkk: 0,
            drawer: false,
            mini: false,
            clipped: true,
            tabItems: [],
            items: [
                {
                    id: 1,
                    menu: [
                        { header: "General" },
                        // {
                        //     title: "Dashboard",
                        //     icon: "mdi-view-dashboard",
                        //     children: [
                        //     ]
                        // },
                        { title: "Curl Tool", icon: "mdi-check",router: "/curl"  },
                        { title: "Ping Tool", icon: "mdi-monitor",router: "/ping"  },
                        { header: "Administrator" },
                        // {
                        //     title: "Users",
                        //     icon: "mdi-account-circle",
                        //     children: [
                        //         {
                        //             title: "group",
                        //             icon: "mdi-view-dashboard",
                        //             children: [
                        //                 {
                        //                     title: "management",
                        //                     icon: "mdi-image"
                        //                 },
                        //                 {
                        //                     title: "setting",
                        //                     icon: "mdi-help-box"
                        //                 }
                        //             ]
                        //         },
                        //         { title: "account", icon: "mdi-image" },
                        //         { title: "block list", icon: "mdi-help-box" }
                        //     ]
                        // },
                        // {
                        //   title: "Content",
                        //   icon: "mdi-account-circle",
                        //   children: [
                        //     { title: "Helper", icon: "mdi-image",router: "/dashboard" },
                        //   ]
                        // },
                      { title: "Helper Manage", icon: "mdi-help",router: "/helper" },
                      { title: "BGP Peer", icon: "mdi-call-made",router: "/bgp" },
                      { title: "Dummy IP", icon: "mdi-forward",router: "/dummy-ip" },
                    ]
                },
                // {
                //     id: 2,
                //     menu: [
                //         { header: "General" },
                //         { title: "Dashboard", icon: "mdi-view-dashboard" },
                //         { title: "Record", icon: "mdi-image" },
                //         { title: "Log", icon: "mdi-help-box" }
                //     ]
                // },
                // {
                //     id: 3,
                //     menu: [
                //         { header: "General" },
                //         { title: "Dashboard", icon: "mdi-view-dashboard" }
                //     ]
                // }
            ],
            admins: [
                ["Management", "mdi-people-outline"],
                ["Settings", "mdi-settings"]
            ]
        };
    },
    watch: {
        tabId() {
            this.navigationControl();
        }
    },
    methods: {
        navigationControl() {
            this.items.forEach((o) => {
                if (o.id == this.tabId) {
                    this.tabItems = o.menu;
                }
            });
        }
    },
    created() {
        this.navigationControl();
    }
};
</script>

