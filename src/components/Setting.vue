<template lang="pug">
    v-menu(v-model="menu" :close-on-content-click="false" :nudge-width="200" transition="slide-y-transition" bottom)
        template(v-slot:activator="{ on }")
            v-btn(icon v-on="on")
                v-icon mdi-settings
        v-card
            v-list
                v-list-item
                    v-list-item-avatar
                        img(src="https://randomuser.me/api/portraits/men/81.jpg")
                    v-list-item-content
                        v-list-item-title James
                        v-list-item-subtitle james.bong@hiero7.com
            v-divider
            v-list
                v-list-item
                    v-list-item-action
                        v-switch(v-model="darkMode") 
                    v-list-item-title  Dark Mode
            v-divider       
            v-list
                v-list-item
                    v-list-item-content(column)
                        v-list-item-title  Theme Color
                        v-list-item-action
                            v-radio-group(v-model="selectedTheme")
                                v-radio(v-for="theme in themeObject" :label="theme.label" :color="theme.color" :value="theme.value")
            v-divider
            v-list
                v-list-item
                    v-list-item-action
                        v-switch(v-model="tableWidth") 
                    v-list-item-title  Narrow Table Mode
</template>
<script>
export default {
    data() {
        return {
            selectedTheme: "",
            menu: false,
            darkMode: false,
            themeObject: [
                { label: "pink", color: "pink", value: "#ee44aa" },
                { label: "red", color: "red", value: "#F44336" },
                {
                    label: "red darken-3",
                    color: "red darken-3",
                    value: "#C62828"
                },
                { label: "indigo", color: "indigo", value: "#3F51B5" },
                {
                    label: "indigo darken-3",
                    color: "indigo darken-3",
                    value: "#283593"
                },
                { label: "orange", color: "orange", value: "#FF9800" },
                {
                    label: "orange darken-3",
                    color: "orange darken-3",
                    value: "#EF6C00"
                },
                { label: "blue", color: "blue", value: "#2196F3" }
            ],
            tableWidth: Boolean
        };
    },
    watch: {
        darkMode(value) {
            this.$vuetify.theme.dark = value;
            this.selectedTheme = this.$vuetify.theme.currentTheme.primary;
        },
        selectedTheme(value) {
            this.$vuetify.theme.currentTheme.primary = value;
        },
        tableWidth(value) {
            this.$store.dispatch("global/showDenseTable", value);
        }
    },
    methods: {
        changeMode() {
            this.menu = false;
        }
    },
    created() {
        this.darkMode = this.$vuetify.theme.dark;
        this.selectedTheme = this.$vuetify.theme.themes.light.primary;
        this.tableWidth = this.$store.getters["global/tableMode"]();
    }
};
</script>