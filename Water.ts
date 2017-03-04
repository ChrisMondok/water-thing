class Water {
  waveSources : WaveSource[] = []
  viscosity = 12 // this is probably totally the wrong name for this

  getZ (timestamp: number, xy: Float32Array) {
    var z = 0

    for (var i = 0; i < this.waveSources.length; i++) {
      z += this.waveSources[i].getZ(timestamp, xy)
    }

    return z
  }

  getNormal (out: Float32Array, timestamp: number, xy: Float32Array) {
    vec3.set(out, 0, 0, 1)

    for (var i = 0; i < this.waveSources.length; i++) {
      this.waveSources[i].accumulateNormal(out, timestamp, xy)
    }

    return vec3.normalize(out, out)
  }
}

abstract class WaveSource extends Actor {
  constructor(game : Game, public fluid : Water) {
    super(game)
  }

  amplitude = 4
  period = 1
  phase = 0

  get frequency() { return 1 / this.period }
  set frequency(f) { this.period = 1 / f }

  getSpeed () {
    return this.fluid.viscosity * this.period
  }

  getWavelength () {
    return this.getSpeed() * this.period
  }

  abstract getZ (timestamp : number, xy : Float32Array) : number
  abstract accumulateNormal(out: Float32Array, timestamp : number, xy : Float32Array): void
}
