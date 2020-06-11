export default {
    methods: {
        checkCurrentPage() {
            const componentName = this.$options.name.toString()
                .toLocaleUpperCase()

            const pathName = this.$router.currentRoute.name.toString()
                .toLocaleUpperCase()

            return componentName == pathName
        }
    }
}