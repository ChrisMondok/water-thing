function Water() {
	this.waveSources = [];
}

Water.prototype.viscosity = 12; //this is probably totally the wrong name for this

Water.prototype.getZ = function(timestamp, vec2) {
	return this.waveSources.map(function(ws) {
		return ws.getZ(timestamp, vec2);
	}).reduce(function(a, b) {
		return a + b;
	}, 0);
};

function WaveSource(fluid) {
	Actor2D.apply(this);
	this.fluid = fluid;
}

WaveSource.prototype = Object.create(Actor2D.prototype);
WaveSource.prototype.amplitude = 4;
WaveSource.prototype.period = 1;
WaveSource.prototype.phase = 0;

Object.defineProperty(WaveSource.prototype, 'frequency', {
	get: function() { return 1/this.period; },
	set: function(f) { return this.period = 1/f; }
});

WaveSource.prototype.getSpeed = function() {
	return this.fluid.viscosity * this.period;
};

WaveSource.prototype.getWavelength = function() {
	return this.getSpeed() * this.period;
};

WaveSource.prototype.getZ = function(timestamp, x, y) {
	return 0;
};


function PointWaveSource(fluid) {
	WaveSource.apply(this, arguments);
	window.pws = this;
}

PointWaveSource.prototype = WaveSource.prototype;

PointWaveSource.prototype.getZ = function(timestamp, vec2d) {
	var dist = this.position.distanceFrom(vec2d);
	var phase = -dist / this.getWavelength() + 2 * Math.PI * (timestamp/ (1000 * this.period)) + this.phase;
	return Math.sin(phase) * this.amplitude;
}
