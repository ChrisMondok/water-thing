class Material {
  diffuse: Float32Array
  emissive: Float32Array
  specular: Float32Array
  ambient: Float32Array
  name?: string

  readonly unrecognizedDirectives: string[] = []

  shininess = 16

  isComplete() {
    return this.diffuse instanceof Float32Array &&
      this.emissive instanceof Float32Array &&
      this.specular instanceof Float32Array &&
      this.ambient instanceof Float32Array &&
      typeof (this.shininess) === 'number'
  }

  clone() {
    var clone = new Material()
    clone.diffuse = this.diffuse && new Float32Array(this.diffuse)
    clone.emissive = this.emissive && new Float32Array(this.emissive)
    clone.specular = this.specular && new Float32Array(this.specular)
    clone.ambient = this.ambient && new Float32Array(this.ambient)
    clone.shininess = this.shininess
    clone.name = this.name
    return clone
  }
}
