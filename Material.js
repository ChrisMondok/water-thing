function Material() { }

Material.prototype.diffuse = null;
Material.prototype.emissive = null;
Material.prototype.reflectivity = 0;
Material.prototype.transparency = 0;

Material.prototype.shininess = 16;

Material.prototype.isComplete = function() {
	return this.diffuse instanceof Float32Array
		&& this.emissive instanceof Float32Array
		&& typeof(this.reflectivity) == 'number'
		&& typeof(this.shininess) == 'number'
		&& typeof(this.transparency) == 'number';
};
