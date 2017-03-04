function degToRad(deg : number) {
  return deg / 180 * Math.PI
}

function radToDeg(rad : number) {
  return rad / Math.PI * 180
}

var lookAt = function() {
  var x = vec3.create()
  var y = vec3.create()
  var z = vec3.create()

  return function lookAt (out : Float32Array, position : Float32Array, target : Float32Array, up : Float32Array) {
    vec3.subtract(z, position, target)
    vec3.normalize(z, z)
    vec3.cross(x, up, z)
    vec3.cross(y, z, x)

    return mat4.set(out,
      x[0], x[1], x[2], 0,
      y[0], y[1], y[2], 0,
      z[0], z[1], z[2], 0,
      position[0], position[1], position[2], 1
    )
  }
}()
