function Material() { }

Material.prototype.diffuse = null;
Material.prototype.emissive = null;
Material.prototype.specular = null;

Material.prototype.shininess = 16;

Material.prototype.isComplete = function() {
	return this.diffuse instanceof Float32Array
		&& this.emissive instanceof Float32Array
		&& this.specular instanceof Float32Array
		&& typeof(this.shininess) == 'number';
};
