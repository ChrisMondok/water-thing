/* globals WaveSource */
function PointWaveSource (fluid) {
  WaveSource.apply(this, arguments)
  window.pws = this
}

PointWaveSource.prototype = WaveSource.prototype

PointWaveSource.prototype.waveFunction = function (x) {
  return Math.pow(((Math.sin(x) + 1) / 2), 5) * this.amplitude
}

PointWaveSource.prototype.slopeFunction = function (x) {
  return 5 / 32 * Math.pow((Math.sin(x) + 1), 4) * Math.cos(x) * this.amplitude
}

;(function () {
  var workArray = vec2.create()

  PointWaveSource.prototype.getPhase = function (timestamp, xy) {
    vec2.subtract(workArray, this.position, xy)
    return -vec2.length(workArray) / this.getWavelength() + 2 * Math.PI * (timestamp / (1000 * this.period)) + this.phase
  }
})()

PointWaveSource.prototype.getZ = function (timestamp, xy) {
  var phase = this.getPhase(timestamp, xy)

  return this.waveFunction(phase)
}

PointWaveSource.prototype.accumulateNormal = function (out, timestamp, xy) {
  var phase = this.getPhase(timestamp, xy)
  var slope = this.slopeFunction(phase) / this.getWavelength()
  var angle = Math.atan2(xy[1] - this.y, xy[0] - this.x)
  out[0] += Math.cos(angle) * slope
  out[1] += Math.sin(angle) * slope
}
