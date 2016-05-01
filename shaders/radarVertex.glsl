precision mediump float;

attribute vec3 a_position;

uniform vec3 u_camera;
uniform mat4 u_projection;
uniform mat4 u_transform;

varying float v_distance;

void main() {
	vec3 vertexWorldPosition = (u_transform * vec4(a_position, 1)).xyz;
	v_distance = length(vertexWorldPosition - u_camera);

	gl_Position = u_projection * u_transform * vec4(a_position, 1);
}
