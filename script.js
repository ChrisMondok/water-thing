addEventListener('load', start);

function start() {
	var canvas = document.querySelector('canvas');

	var world = window.world = new DebugWorld(canvas);

	world.ready.then(function() {
		console.log("WORLD READY");
	});
}
