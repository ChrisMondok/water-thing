function Buoy(gl, water, color) {
	Actor.apply(this);

	this.water = water;
	this.vertices = this.createVertices();
	this.colors = this.createColors(color);

	Drawable.call(this, gl);
}

Buoy.prototype = Object.create(Drawable.prototype);

Buoy.prototype.radius = 15;
Buoy.prototype.facetRes = 12;
Buoy.prototype.height = 50;

Buoy.prototype.createVertices = function() {
	var verts = [];
	var angle, x, y;
	for(var i = 0; i <= this.facetRes; i++) {
		angle = (i/this.facetRes % 1) * 2 * Math.PI;
		x = Math.cos(angle) * this.radius;
		y = Math.sin(angle) * this.radius;

		verts.push(x, y, -this.height / 4);
		verts.push(x, y, 3 * this.height / 4);
	}

	//TODO: top and bottom

	return new Float32Array(verts);
};

Buoy.prototype.tick = function(timestamp) {
	this.z = this.water.getZ(timestamp, Vector.create([this.x, this.y]));
};

Buoy.prototype.createColors = function(color) {
	var colors = new Float32Array(this.vertices.length / 3 * 4);
	for(var i = 0; i < colors.length; i += 4) {
		colors[i + 0] = color[0];
		colors[i + 1] = color[1];
		colors[i + 2] = color[2];
		colors[i + 3] = 1;
	}

	return colors;
};
