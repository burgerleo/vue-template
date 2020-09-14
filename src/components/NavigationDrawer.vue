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
                    title: 'Table',
                    display: true,
                    active: false,
                    items: [
                        {
                            icon: 'mdi-access-point',
                            title: 'SortByTable',
                            display: true,
                            router: '/sortbytable'
                        },
                    ]
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'Table Example',
                    display: true,
                    active: false,
                    router: '/table-example'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'Table2 Example',
                    display: true,
                    active: false,
                    router: '/table2-example'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'NXN Example',
                    display: true,
                    active: false,
                    router: '/nxn-example'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'TextBox Example',
                    display: true,
                    active: false,
                    router: '/textbox-example'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'TwoList',
                    display: true,
                    active: false,
                    router: '/two-list'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'Table Column',
                    display: true,
                    active: false,
                    router: '/table-column'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'Lookup',
                    display: true,
                    active: false,
                    items: [
                        {
                            icon: 'mdi-access-point',
                            title: 'Lookup2',
                            display: true,
                            router: '/about'
                        },
                        {
                            // icon: 'mdi-access-point',
                            title: 'Lookup3',
                            display: true,
                            router: '/about'
                        }
                    ]
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'Component 1',
                    display: true,
                    active: false,
                    router: '/component1'
                },
                {
                    tabId: 0,
                    icon: 'mdi-magnify',
                    title: 'AlexDay12',
                    display: true,
                    active: false,
                    router: '/alexday12'
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
