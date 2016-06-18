function Water() {
	this.waveSources = [];
}

Water.prototype.viscosity = 12; //this is probably totally the wrong name for this

Water.prototype.getZ = function(timestamp, xy) {
	var z = 0;

	for(var i = 0; i < this.waveSources.length; i++)
		z += this.waveSources[i].getZ(timestamp, xy);

	return z;
};

Water.prototype.getSlope = function(timestamp, xy) {
	var slope = vec2.create();

	for(var i = 0; i < this.waveSources.length; i++) {
		var wss = this.waveSources[i].getSlope(timestamp, xy);
		vec2.add(slope, slope, wss)
	}

	return slope;
};

Water.prototype.getNormal = function(timestamp, xy) {
	var slope = this.getSlope(timestamp, xy);
	var slope3d = vec3.fromValues(slope[0], slope[1], 1)
	return vec3.normalize(slope3d, slope3d)
};

function WaveSource(fluid) {
	Actor.apply(this);
	this.fluid = fluid;
}

WaveSource.prototype = Object.create(Actor.prototype);
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

WaveSource.prototype.getZ = function(timestamp, xy) {
	return 0;
};

WaveSource.prototype.getSlope = function(timestamp, xy) {
	return vec2.create();
};
