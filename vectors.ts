function getUpVector (out: Float32Array, lookVector : Float32Array) {
  var declination = Math.asin(lookVector[2])

  var xyAngle = Math.PI + Math.atan2(lookVector[1], lookVector[0])

  return vec3.set(out,
    Math.cos(xyAngle) * Math.sin(declination),
    Math.sin(xyAngle) * Math.sin(declination),
    Math.cos(declination)
  )
}
