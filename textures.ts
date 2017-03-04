function createTexture (gl : WebGLRenderingContext, width : number, height : number) : WebGLTextureWithDimensions {
  var texture = <WebGLTextureWithDimensions>(gl.createTexture())
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, undefined)

  // this does nothing, but it's handy to have.
  texture.width = width
  texture.height = height

  return texture
}

function createFramebuffer (gl : WebGLRenderingContext, texture : WebGLTexture, width : number, height : number) {
  var fb = notNull(gl.createFramebuffer())
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

  var rb = gl.createRenderbuffer()
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb)

  gl.bindTexture(gl.TEXTURE_2D, null)
  gl.bindRenderbuffer(gl.RENDERBUFFER, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  return fb
}

interface WebGLTextureWithDimensions extends WebGLTexture {
  width: number
  height: number
}
