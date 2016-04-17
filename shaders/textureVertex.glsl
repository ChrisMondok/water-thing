attribute vec3 a_position;

varying vec2 v_texcoord;

void main() {
	gl_Position = vec4((a_position * 2.0) - vec3(1.0), 1.0);
	v_texcoord = a_position.xy;
}
