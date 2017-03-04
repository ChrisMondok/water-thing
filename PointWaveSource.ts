/// <reference path="Water.ts"/>

class PointWaveSource extends WaveSource {
  private waveFunction (x) {
    return Math.pow(((Math.sin(x) + 1) / 2), 5) * this.amplitude
  }

  private slopeFunction (x) {
    return 5 / 32 * Math.pow((Math.sin(x) + 1), 4) * Math.cos(x) * this.amplitude
  }

  private static readonly scratch2d = vec2.create()

  private getPhase (timestamp, xy) {
    vec2.subtract(PointWaveSource.scratch2d, this.position, xy)
    return -vec2.length(PointWaveSource.scratch2d) / this.getWavelength() + 2 * Math.PI * (timestamp / (1000 * this.period)) + this.phase
  }

  getZ (timestamp, xy) {
    var phase = this.getPhase(timestamp, xy)

    return this.waveFunction(phase)
  }

  accumulateNormal (out, timestamp, xy) {
    var phase = this.getPhase(timestamp, xy)
    var slope = this.slopeFunction(phase) / this.getWavelength()
    var angle = Math.atan2(xy[1] - this.y, xy[0] - this.x)
    out[0] += Math.cos(angle) * slope
    out[1] += Math.sin(angle) * slope
  }
}
