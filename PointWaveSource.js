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

(function() {
	var workArray2d = [0, 0];

	PointWaveSource.prototype.getPhase = function(timestamp, xy) {
		workArray2d[0] = 0;
		workArray2d[1] = 0;
		workArray2d.add(this.position.elements).subtract(xy);
		return -workArray2d.magnitude() / this.getWavelength() + 2 * Math.PI * (timestamp/ (1000 * this.period)) + this.phase;
	};
})();

PointWaveSource.prototype.getZ = function(timestamp, xy) {
	var phase = this.getPhase(timestamp, xy);

	return this.waveFunction(phase);
};

PointWaveSource.prototype.getSlope = function(timestamp, xy) {
	var phase = this.getPhase(timestamp, xy);
	var slope =  this.slopeFunction(phase) / this.getWavelength();
	var angle = Math.atan2(xy[1] - this.y, xy[0] - this.x);
	return [ Math.cos(angle) * slope, Math.sin(angle) * slope ];
};
