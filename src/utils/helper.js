export default {
    methods: {
        getRandomByMinMax(min = 0, max = 100) {
            // max - 期望的最大值
            // min - 期望的最小值
            parseInt(Math.random() * (max - min + 1) + min, 10)
            return Math.floor(
                Math.random() * (max - min + 1) + min
            )
        }
    }
}