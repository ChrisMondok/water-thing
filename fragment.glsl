precision mediump float;

uniform vec3 u_ambient_light;
uniform vec3 u_sun;
uniform vec3 u_camera;

uniform vec3 u_diffuse;
uniform vec3 u_ambient;
uniform float u_shininess;
uniform float u_reflectivity;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;

const float screen_gamma = 2.2;

mediump float compute_lambertian() {
	return max(dot(normalize(v_vertex_normal), u_sun), 0.0);
}

mediump vec3 compute_diffuse() {
	return u_diffuse * compute_lambertian();
}

mediump vec3 compute_ambient() {
	return u_diffuse * u_ambient_light;
}

mediump vec3 compute_specular() {
	vec3 normal = normalize(v_vertex_normal);
	vec3 light_direction = normalize(u_sun);

	float lambertian = compute_lambertian();
	float power = 0.0;

	if(lambertian > 0.0 || lambertian <= 0.0) {
		vec3 view_direction = normalize(u_camera);

		vec3 half_dir = normalize(light_direction + view_direction);

		float spec_angle = max(dot(half_dir, normal), 0.0);
		power = pow(spec_angle, u_shininess);
	}

	return vec3(u_reflectivity * power);
}

void main() {
	vec3 color_linear = compute_ambient() + compute_diffuse() + compute_specular();
	vec3 color_gamma_corrected = pow(color_linear, vec3(1.0/screen_gamma));
	gl_FragColor = vec4(color_gamma_corrected, 1);
}
