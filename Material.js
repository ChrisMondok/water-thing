function Material() {
}

Material.prototype.ambient = null;
Material.prototype.diffuse = null;
Material.prototype.specular = null;

Material.prototype.shininess = 16;

Material.prototype.isComplete = function() {
	return this.ambient instanceof Float32Array
		&& this.diffuse instanceof Float32Array
		&& this.specular instanceof Float32Array
		&& typeof(this.shininess) == 'number';
};
