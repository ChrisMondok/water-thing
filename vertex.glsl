attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_projection;

uniform mat4 u_translation;
uniform mat4 u_rotation;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;

void main() {
	gl_Position = u_projection * u_translation * u_rotation * vec4(a_position, 1);

	v_vertex_pos = (u_translation * u_rotation * vec4(a_position, 1)).xyz;
	v_vertex_normal = (u_rotation * vec4(a_normal, 1)).xyz;
}
