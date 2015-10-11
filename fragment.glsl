precision mediump float;

varying vec3 v_color;

const float screen_gamma = 2.2;

void main() {
	vec3 color_gamma_corrected = pow(v_color, vec3(1.0/screen_gamma));
	gl_FragColor = vec4(color_gamma_corrected, 1);
}
