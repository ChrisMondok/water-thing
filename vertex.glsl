attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_camera;
uniform vec3 u_sun_direction;

uniform vec3 u_color;
uniform mat4 u_translation;
uniform mat4 u_rotation;

varying vec3 v_color;

void main() {
	gl_Position = u_camera * u_translation * u_rotation * vec4(a_position, 1);

	mediump vec3 transformed_normal = (u_rotation * vec4(a_normal, 1)).xyz;
	v_color = u_color * max(dot(transformed_normal, u_sun_direction), 0.0);
}
