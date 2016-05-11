precision mediump float;

uniform vec3 u_camera;

uniform float u_pulse_radius;

varying float v_distance;

void main() {
	float pulseWidth = 5.0;

	float pulseIntensity = 1.1 * (1.0 - min(1.0, max(0.0, abs(v_distance - u_pulse_radius)/pulseWidth)));

	float lingerIntensity = 0.0;
	if(v_distance < u_pulse_radius)
		lingerIntensity = max(0.0, 0.6 * (v_distance + 200.0 - u_pulse_radius) / 200.0);

	float i = pulseIntensity + lingerIntensity;
	gl_FragColor = vec4(i-1.0, i, i-1.0, i);
}
