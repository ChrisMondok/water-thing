attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_projection;

uniform mat4 u_transform;

uniform mat4 u_sun_projection;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;
varying vec3 v_lightmap_pos;

void main() {
	gl_Position = u_projection * u_transform * vec4(a_position, 1);

	v_vertex_pos = (u_transform * vec4(a_position, 1)).xyz;
	v_vertex_normal = (u_transform * vec4(a_normal, 0)).xyz;

	v_lightmap_pos = (((u_sun_projection * u_transform * vec4(a_position, 1)).xyz) + vec3(1.0))/2.0;
}
