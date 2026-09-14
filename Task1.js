/*
// 1
console.log("--- 1 ---")

const sampleTask = {
    id: 101,
    title: 'Синхронізація локальних даних',
    priority: 'high',
}

let delayedGreeting = (name, delay, callback) => {
    return setTimeout(() => callback(`Hello, ${name}!`, new Date().toLocaleDateString()), delay)
}

const timerId = delayedGreeting('Олексій', 5000, (greeting, time) => {
    console.log(`${greeting} (Виконано о: ${time})`)
})
*/

/*// 2
console.log("--- 2 ---")

const printNumbersInterval = (from, to, stepDelay) => {
    let id = setInterval(() => {
        if (from >= to) {
            clearInterval(id)
        }
        console.log(from++)
    }, stepDelay)
}

const printNumbersTimeout = (from, to, stepDelay) => {
    if (from > to) return

    setTimeout(() => {
        console.log(from++)
        printNumbersTimeout(from, to, stepDelay)
    }, stepDelay)
}

printNumbersInterval(1, 5, 1000)
printNumbersTimeout(10, 12, 500)*/

// 3
console.log("--- 3 ---")

const createCountdown = (seconds, onTick, onComplete) => {
    let countdown = {
        originalSeconds: seconds,
        onTick: onTick,
        onComplete: onComplete,
        remainingSeconds: seconds,
        timerId: 0,

        pause() {
            clearTimeout(this.timerId)
        },

        resume() {
            if (this.remainingSeconds === 0) {
                this.onComplete()
                return
            }

            this.onTick(this.remainingSeconds)

            --this.remainingSeconds

            this.timerId = setTimeout(() => this.resume(), 1000)
        },

        stop() {
            clearTimeout(this.timerId)
            this.remainingSeconds = this.originalSeconds
        }
    }

    countdown.resume()
    return countdown
}

const countdown = createCountdown(
    5,
    sec => console.log(`Залишилось: ${sec} сек`),
    () => console.log('Час вичерпано!')
)

setTimeout(() => countdown.pause(), 1000)
setTimeout(() => countdown.resume(), 3000)
setTimeout(() => countdown.stop(), 4000)
setTimeout(() => countdown.resume(), 5000)
