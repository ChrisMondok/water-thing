attribute vec4 a_position;
attribute vec3 a_color;

uniform mat4 u_transform;

varying vec3 v_color;

void main() {
	gl_Position = u_transform * a_position;
	v_color = a_color;
}
