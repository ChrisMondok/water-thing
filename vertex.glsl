attribute vec3 a_position;
attribute vec3 a_normal;

uniform bool u_reflection;
uniform mat4 u_projection;
uniform mat4 u_transform;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;

void main() {
	if(u_reflection) {
		mat4 u_mirror;
		u_mirror[0] = vec4(1, 0, 0, 0);
		u_mirror[1] = vec4(0, 1, 0, 0);
		u_mirror[2] = vec4(0, 0, -1, 0);
		u_mirror[3] = vec4(0, 0, 0, 1);

		gl_Position = u_projection * (u_mirror * u_transform)* vec4(a_position, 1);
	}
	else
		gl_Position = u_projection * u_transform * vec4(a_position, 1);

	v_vertex_pos = (u_transform * vec4(a_position, 1)).xyz;
	v_vertex_normal = (u_transform * vec4(a_normal, 0)).xyz;
}
