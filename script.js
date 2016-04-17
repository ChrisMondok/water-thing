addEventListener('load', start);

var transformation = Matrix.I(4);

var pyramidVerts = new Float32Array([
	-0.5, -0.5,  0.0, //lower left
	 0.5, -0.5,  0.0, //lower right
	 0.0,  0.5,  0.0, //top
	 0.0,  0.0,  0.25, //center
	-0.5, -0.5,  0.0, //lower left
	 0.5, -0.5,  0.0 //lower right
]);

function start() {
	var canvas = document.querySelector('canvas');

	var world = window.world = new DemoWorld(canvas);

	world.ready.then(function() {
		console.log("WORLD READY");
	});
}
