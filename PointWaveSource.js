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
