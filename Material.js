var Material = (function () {
    function Material() {
        this.unrecognizedDirectives = [];
        this.shininess = 16;
    }
    Material.prototype.isComplete = function () {
        return this.diffuse instanceof Float32Array &&
            this.emissive instanceof Float32Array &&
            this.specular instanceof Float32Array &&
            this.ambient instanceof Float32Array &&
            typeof (this.shininess) === 'number';
    };
    Material.prototype.clone = function () {
        var clone = new Material();
        clone.diffuse = this.diffuse && new Float32Array(this.diffuse);
        clone.emissive = this.emissive && new Float32Array(this.emissive);
        clone.specular = this.specular && new Float32Array(this.specular);
        clone.ambient = this.ambient && new Float32Array(this.ambient);
        clone.shininess = this.shininess;
        clone.name = this.name;
        return clone;
    };
    return Material;
}());
