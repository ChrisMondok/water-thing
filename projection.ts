function orthoMatrix (out: Float32Array, width : number, height = width, depth = height) {
  return mat4.set(out,
    2 / width, 0, 0, 0,
    0, 2 / height, 0, 0,
    0, 0, -2 / depth, 0,
    0, 0, 0, 1
  )
}
