function Material() {
}

Material.prototype.ambient = null;
Material.prototype.diffuse = null;
Material.prototype.reflectivity = 0;

Material.prototype.shininess = 16;

Material.prototype.isComplete = function() {
	return this.ambient instanceof Float32Array
		&& this.diffuse instanceof Float32Array
		&& typeof(this.reflectivity) == 'number'
		&& typeof(this.shininess) == 'number';
};
