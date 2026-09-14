// 1
console.log("--- 1 ---")

const orderService = {
    taxRate: 0.2,
    calculateTotal(price, discount = 0) {
        const discounted = price - (price * discount)
        return discounted + (discounted * this.taxRate)
    }
}

let cachingDecorator = (func, hashFn) => {
    let cache = new Map()

    if (!hashFn) {
        hashFn = (...args) => [].join.call(args)
    }

    let resultFunc = function () {
        let key = hashFn(arguments)

        if (cache.has(key)) {
            console.log("Returned from cache")
            return cache.get(key)
        }
        console.log("Calculated normally")

        let result = func.apply(this, arguments)
        cache.set(key, result)
        return result
    }

    resultFunc.clearCache = () => {
        this.cache = new Map()
    }

    return resultFunc
}

orderService.calculateTotal = cachingDecorator(orderService.calculateTotal)

console.log(orderService.calculateTotal(100, 0.1)) // Обчислюється: 108
console.log(orderService.calculateTotal(100, 0.1)) // Повертається з кешу: 108

orderService.calculateTotal.clearCache()

// 2
console.log("--- 2 ---")

const spyDecorator = (func) => {
    calls = []

    return function() {
        calls.push({
            arguments,
            timestamp: new Date()
        })

        return func.apply(this, arguments)
    }
}

function sendEmail(to, subject) {
    return `Лист надіслано до ${to}: ${subject}`
}

const spiedSendEmail = spyDecorator(sendEmail)

spiedSendEmail('user@test.com', 'Вітаємо!')
spiedSendEmail('admin@test.com', 'Звіт за день')

console.log(spiedSendEmail.calls.length) // 2
console.log(spiedSendEmail.calls[0].args) // ['user@test.com', 'Вітаємо!']
console.log(spiedSendEmail.calls[0].timestamp) // рядок з датою або Date