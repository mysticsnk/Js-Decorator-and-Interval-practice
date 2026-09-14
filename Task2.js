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

    let wrapper = function () {
        let key = hashFn(...arguments)

        if (cache.has(key)) {
            console.log("Returned from cache")
            return cache.get(key)
        }
        console.log("Calculated normally")

        let result = func.apply(this, arguments)
        cache.set(key, result)
        return result
    }

    wrapper.clearCache = () => {
        this.cache = new Map()
    }

    return wrapper
}

orderService.calculateTotal = cachingDecorator(orderService.calculateTotal)

console.log(orderService.calculateTotal(100, 0.1)) // Обчислюється: 108
console.log(orderService.calculateTotal(100, 0.1)) // Повертається з кешу: 108

orderService.calculateTotal.clearCache()

// 2
console.log("--- 2 ---")

const spyDecorator = (func) => {
    calls = []
    
    let wrapper = function() {
        calls.push({
            args: [...arguments],
            timestamp: new Date()
        })

        return func.apply(this, arguments)
    }
    
    wrapper.calls = calls
    
    return wrapper
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

/*// 3
console.log("--- 3 ---")

const delayDecorator = (func, ms) => {
    return function() {
        setTimeout(() => func(...arguments), ms)
    }
}

function logAction(action, target) {
    console.log(`[${this?.role || 'Гість'}] Дія: ${action}, ціль: ${target}`)
}

const user = {
    role: 'Модератор',
    logAction: delayDecorator(logAction, 1500)
}

user.logAction('Блокування', 'User #42')
// Через 1.5 секунди виведе: [Модератор] Дія: Блокування, ціль: User #42*/

// 4
console.log("--- 4 ---")

const debounceDecorator = (func, wait) => {
    let timerId

    let wrapper = function() {
        if (timerId) {
            clearTimeout(timerId)
        }

        timerId = setTimeout(() => func(...arguments), wait)
    }

    wrapper.cancel = () => {
        clearTimeout(timerId)
    }

    return wrapper
}

function onSearchInput(query) {
    console.log(`Пошуковий запит відправлено: ${query}`)
}

const debouncedSearch = debounceDecorator(onSearchInput, 2000)

debouncedSearch('j')
debouncedSearch('jav')
debouncedSearch('javas')
debouncedSearch('javascript')

setTimeout(() => debouncedSearch.cancel(), 3000)

debouncedSearch('javascript language')