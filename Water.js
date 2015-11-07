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

Water.prototype.getSlope = function(timestamp, vec2) {
	var slope = [0, 0];

	for(var i = 0; i < this.waveSources.length; i++) {
		var wss = this.waveSources[i].getSlope(timestamp, vec2);
		slope[0] += wss[0];
		slope[1] += wss[1];
	}

	return slope;
};

Water.prototype.getNormal = function(timestamp, vec2) {
	var slope = this.getSlope(timestamp, vec2);
	return Vector.create([slope[0], -slope[1], 1]).normalize();
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

PointWaveSource.prototype.waveFunction = function(x) {
	return Math.pow(((Math.sin(x) + 1) / 2), 5) * this.amplitude;
};

PointWaveSource.prototype.slopeFunction = function(x) {
	return 5/32 * Math.pow((Math.sin(x) + 1), 4) * Math.cos(x) * this.amplitude;
};

PointWaveSource.prototype.getPhase = function(timestamp, vec2d) {
	var dist = this.position.distanceFrom(vec2d);
	return -dist / this.getWavelength() + 2 * Math.PI * (timestamp/ (1000 * this.period)) + this.phase;
};

PointWaveSource.prototype.getZ = function(timestamp, vec2d) {
	var phase = this.getPhase(timestamp, vec2d);

	return this.waveFunction(phase);
};

PointWaveSource.prototype.getSlope = function(timestamp, vec2d) {
	var phase = this.getPhase(timestamp, vec2d);
	var slope =  this.slopeFunction(phase) / this.getWavelength();
	var angle = Math.atan2(vec2d.e(2) - this.y, vec2d.e(1) - this.x);
	return [ Math.cos(angle) * slope, Math.sin(angle) * slope ];
};
