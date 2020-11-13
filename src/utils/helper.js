export default {
    methods: {
        getRandomByMinMax(min = 0, max = 100) {
            // max - 期望的最大值
            // min - 期望的最小值
            parseInt(Math.random() * (max - min + 1) + min, 10)
            return Math.floor(
                Math.random() * (max - min + 1) + min
            )
        },
        // 亂數英文字
        makerandomletter(max = 0) {
            max = max > 0 ? max : this.getRandomByMinMax(1, 4)
            var text = ''
            var possible = 'abcdefghijklmnopqrstuvwxyz'

            for (var i = 0; i < max; i++)
                text += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                )
            return text
        },
        //產生min到max之間的亂數
        getRandom(min = 0, max = 10) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        },
        // 產生亂數字串
        randomstring(L = 5) {
            var s = ''
            var randomchar = function () {
                var n = Math.floor(Math.random() * 62)
                if (n < 10) return n //1-10
                if (n < 36) return String.fromCharCode(n + 55) //A-Z
                return String.fromCharCode(n + 61) //a-z
            }
            while (s.length < L) s += randomchar()
            return s
        },
    }
}