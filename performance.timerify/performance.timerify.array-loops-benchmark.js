const {
  performance,
  PerformanceObserver
} = require('perf_hooks')

function preDefinedArraySizeUsingVarAndFor (n = 10) {
  var a = new Array(n)
  for (var i = n; i--;) a[i] = i * i

  return a
}
console.log(preDefinedArraySizeUsingVarAndFor(), preDefinedArraySizeUsingVarAndFor.name)

function preDefinedArraySizeUsingConstLetAndFor (n = 10) {
  const a = new Array(n)
  for (let i = n; i--;) a[i] = i * i

  return a
}
console.log(preDefinedArraySizeUsingConstLetAndFor(), preDefinedArraySizeUsingConstLetAndFor.name)

function ArrayPushUsingVarAndFor (n = 10) {
  var a = []
  for (var i = 0; i < n; i++) a.push(i * i)

  return a
}
console.log(ArrayPushUsingVarAndFor(), ArrayPushUsingVarAndFor.name)

const ArrayDotFrom = (length = 10) => Array.from({ length }, (_, i) => i * i)
console.log(ArrayDotFrom(), ArrayDotFrom.name)

const testA = performance.timerify(preDefinedArraySizeUsingVarAndFor)
const testB = performance.timerify(ArrayDotFrom)
const testC = performance.timerify(preDefinedArraySizeUsingConstLetAndFor)
const testD = performance.timerify(ArrayPushUsingVarAndFor)

const obs = new PerformanceObserver((list) => {
  const report = list.getEntries().reduce((o, _) => { if (!o[_.name]) o[_.name] = { durations: [], get avg () { return this.durations.reduce((a, b) => a + b) / this.durations.length } }; o[_.name].durations.push(_.duration); return o }, {})
  const reportEntries = Object.entries(report)
  const summary = reportEntries.map(([k, v]) => ({ function: k, avg: v.avg })).sort((a, b) => a.avg - b.avg)
  const maxNameLength = Math.max(...reportEntries.map(([k]) => k.length))
  console.log(`Node version: ${process.version}`)
  // console.log(JSON.stringify(summary, undefined, 2))
  console.log(JSON.stringify(summary.map(o => `${o.function.padEnd(maxNameLength)} => ${o.avg}`), undefined, 2))

  obs.disconnect()
})

// obs.observe({ entryTypes: ['function'] })
obs.observe({ entryTypes: ['function'], buffered: true })

const times = Math.abs(process.argv[2]) || 10
// A performance timeline entry will be created
for (let i = times; i--;) testB(10000)
for (let i = times; i--;) testA(10000)
for (let i = times; i--;) testC(10000)
for (let i = times; i--;) testD(10000)
