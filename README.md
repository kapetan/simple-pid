# simple-pid

A simple PID controller ported from [m-lundberg/simple-pid](https://github.com/m-lundberg/simple-pid) to JavaScript.

    npm install @kapetan/simple-pid

# Usage

The constructor accepts the PID controller parameters, a desired setpoint and additional options.

```js
const PID = require('@kapetan/simple-pid')

const pid = new PID(1, 0.1, 0.05, 1)

let pv = controlledSystem.update(0)

while (true) {
  const correction = pid.update(pv)
  pv = controlledSystem.update(correction)
}
```

# API

## Class: `PID`

PID controller.

### `new PID(kp, ki, kd, setpoint[, options])`

* `kp` The value for the proportional gain.
* `ki` The value for the integral gain.
* `kd` The value for the derivative gain.
* `setpoint` The initial setpoint that the PID will try to achieve.
* `options`
    * `sampleTime` The time in milliseconds which the controller should wait before generating a new output value. The PID works best when it is constantly called (eg. during a loop), but with a sample time set so that the time difference between each update is (close to) constant. If set to None, the PID will compute a new output value every time it is called. **Default:** `10`,
    * `outputLimits` The initial output limits to use, given as an array with 2 elements, for example: [lower, upper]. The output will never go below the lower limit or above the upper limit. Either of the limits can also be set to null to have no limit in that direction. Setting output limits also avoids integral windup, since the integral term will never be allowed to grow outside of the limits. **Default:** `[]`.
    * `autoMode` Whether the controller should be enabled (auto mode) or not (manual mode). **Default:** `true`.
    * `proportionalOnMeasurement` Whether the proportional term should be calculated on the input directly rather than on the error (which is the traditional way). Using proportional-on-measurement avoids overshoot for some types of systems. **Default:** `false`.
    * `errorMap` Function to transform the error value in another constrained value. **Default:** `x => x`.

Initialize a new PID controller.

### `pid.update(input[, dt])`

* `input` The new input value.
* `dt` If set, uses this value for timestep instead of real time. This can be used in simulations when simulation time is different from real time. **Default:** `null`.

Update the PID controller with *input* and calculate and return a control output if `sampleTime` seconds has passed since the last update. If no new output is calculated, return the previous output instead (or `null` if no value has been calculated yet).
