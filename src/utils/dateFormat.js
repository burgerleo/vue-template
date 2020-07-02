export default {
    methods: {
        getDateYear(date) {
            return date.getFullYear()
        },
        getDateMonth(date) {
            /*
            *  在日期格式中，月份是從 0 開始的，因此要加 1
            *  使用三元表達式在小於 10 的前面加 0，以達到格式統一 如 09:11:05
            */
            return date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        },
        getDateDay(date) {
            return date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        },
        getDateHour(date) {
            return date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        },
        getDateMinute(date) {
            return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        },
        getDateSecond(date) {
            return date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        },
        dateFormat(date) {
            var year = this.getDateYear(date)
            var month = this.getDateMonth(date)
            var day = this.getDateDay(date)
            var hours = this.getDateHour(date)
            var minutes = this.getDateMinute(date)

            // 拼接
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
        },
        dateFormat2(date) {
            var year = this.getDateYear(date)
            var month = this.getDateMonth(date)
            var day = this.getDateDay(date)
            var hours = this.getDateHour(date)
            var minutes = this.getDateMinute(date)
            var second = this.getDateSecond(date)

            // 拼接
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + second
        }
    }
}