attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_projection;

uniform mat4 u_transform;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;

void main() {
	gl_Position = u_projection * u_transform * vec4(a_position, 1);

	v_vertex_pos = (u_transform * vec4(a_position, 1)).xyz;
	v_vertex_normal = (u_transform * vec4(a_normal, 0)).xyz;
}
