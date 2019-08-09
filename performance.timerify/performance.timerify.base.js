console.log(process.version)

const {
  performance,
  PerformanceObserver
} = require('perf_hooks')

function someFunction () {
  console.log('hello world')
}
someFunction()

const otherFunction = () => {
  process.stdout.write('=> other\n')
}
otherFunction()

const wrapped = performance.timerify(someFunction)
const other = performance.timerify(otherFunction)

// const obs = new PerformanceObserver((list) => {
// //   console.log(list.getEntries()[0].duration)
// //   console.log(list.getEntries())
//   console.log(list.getEntries().map(_ => _.duration))
// //   obs.disconnect()
// })
// obs.observe({ entryTypes: ['function'] })
// // obs.observe({ entryTypes: ['function'], buffered: true })
const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration)
  obs.disconnect()
})
obs.observe({ entryTypes: ['function'] })

// A performance timeline entry will be created
for (let i = Math.abs(process.argv[2]); i--;) other()
setImmediate(() => { for (let i = Math.abs(process.argv[2]); i--;) wrapped() })
