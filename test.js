const test = require('tape')
const PID = require('.')

test('zero', t => {
  const pid = new PID(1, 1, 1, 0)

  t.equal(pid.update(0), 0)
  t.end()
})

test('P', t => {
  const pid = new PID(1, 0, 0, 10, { sampleTime: null })

  t.equal(pid.update(0), 10)
  t.equal(pid.update(5), 5)
  t.equal(pid.update(-5), 15)
  t.end()
})

test('P negative setpoint', t => {
  const pid = new PID(1, 0, 0, -10, { sampleTime: null })

  t.equal(pid.update(0), -10)
  t.equal(pid.update(5), -15)
  t.equal(pid.update(-5), -5)
  t.equal(pid.update(-15), 5)
  t.end()
})

test('I', t => {
  const pid = new PID(0, 10, 0, 10, { sampleTime: 100 })

  t.equal(pid.update(0, 100), 10)
  t.equal(pid.update(0, 100), 20)
  t.end()
})

test('I negative setpoint', t => {
  const pid = new PID(0, 10, 0, -10, { sampleTime: 100 })

  t.equal(pid.update(0, 100), -10)
  t.equal(pid.update(0, 100), -20)
  t.end()
})

test('D', t => {
  const pid = new PID(0, 0, 0.1, 10, { sampleTime: 100 })

  t.equal(pid.update(0), 0)
  t.equal(pid.update(0, 100), 0)
  t.equal(pid.update(0), 0)
  t.equal(pid.update(5, 100), -5)
  t.equal(pid.update(15, 100), -10)
  t.end()
})

test('D negative setpoint', t => {
  const pid = new PID(0, 0, 0.1, -10, { sampleTime: 100 })

  t.equal(pid.update(0), 0)
  t.equal(pid.update(0, 100), 0)
  t.equal(pid.update(0), 0)
  t.equal(pid.update(5, 100), -5)
  t.equal(pid.update(-5, 100), 10)
  t.equal(pid.update(-15, 100), 10)
  t.end()
})

test('desired state', t => {
  const pid = new PID(10, 5, 2, 10, { sampleTime: null })

  t.equal(pid.update(10), 0)
  t.end()
})

test('output limits', t => {
  const pid = new PID(100, 20, 40, 10, { sampleTime: null, outputLimits: [0, 100] })

  t.equal(pid.update(0, 100), 100)
  t.equal(pid.update(100, 100), 0)
  t.end()
})

test('sample time', t => {
  const pid = new PID(1, 0, 0, 10, { sampleTime: 10000 })

  t.equal(pid.update(0), 10)
  t.equal(pid.update(100, 1000), 10)
  t.end()
})

test('auto mode', t => {
  const pid = new PID(1, 0, 0, 10, { sampleTime: null })

  t.equal(pid.update(0), 10)
  t.equal(pid.update(5), 5)

  pid.autoMode = false

  t.equal(pid.update(1), 5)
  t.equal(pid.update(7), 5)

  pid.autoMode = true

  t.equal(pid.integral, 0)
  t.equal(pid.update(8), 2)

  pid.autoMode = false
  pid.setAutoMode(true, 10)

  t.equal(pid.integral, 10)
  t.end()
})

test('converge system', t => {
  let pv = 0
  const pid = new PID(1, 0.8, 0.04, 5, { sampleTime: 10, outputLimits: [-5, 5] })
  // Simple system model
  const updateSystem = (correction, dt) => pv + (correction * dt - 1 * dt) / 1000

  for (let i = 0; i < 60; i++) {
    const correction = pid.update(pv, 1000)
    pv = updateSystem(correction, 1000)
  }

  t.equals(pv, 5)
  t.end()
})

test('error map', t => {
  const errorMap = angle => {
    if (angle > Math.PI) return angle - 2 * Math.PI
    else if (angle < -Math.PI) return angle + 2 * Math.PI
    return angle
  }

  const pid = new PID(1, 0, 0, 0, { sampleTime: 100, errorMap })

  t.equal(pid.update(5), errorMap(-5))
  t.end()
})
