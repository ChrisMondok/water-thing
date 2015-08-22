function Pyramid(gl) {
	this.vertices = new Float32Array([
		- 50.0, - 50.0, +  0.0, //lower left
		+ 50.0, - 50.0, +  0.0, //lower right
	 	+  0.0, + 50.0, +  0.0, //top
	 	+  0.0, +  0.0, + 50.0, //center
		- 50.0, - 50.0, +  0.0, //lower left
		+ 50.0, - 50.0, +  0.0 //lower right
	]);

	this.colors = new Float32Array([
		0, 0, 1, 1, //lower left, blue
		0, 1, 0, 1, //lower right, green
		1, 0, 0, 1, //top, red
		0.5, 0.5, 0.5, 1, //center, grey
		0, 0, 1, 1, //lower left, blue
		0, 1, 0, 1  //lower right, green
	]);

	Drawable.apply(this, arguments);
}

Pyramid.prototype = Object.create(Drawable.prototype);
