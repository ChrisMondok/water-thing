precision mediump float;

uniform vec3 u_ambient_light;
uniform vec3 u_sun;
uniform vec3 u_camera;

uniform sampler2D u_lightmap_sampler;

uniform vec3 u_diffuse;
uniform vec3 u_emissive;
uniform vec3 u_specular;
uniform float u_shininess;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;
varying vec3 v_lightmap_pos;

const float screen_gamma = 2.2;

const float shadow_fudge_factor = 0.005;

bool is_in_shadow() {
	vec4 tc = texture2D(u_lightmap_sampler, v_lightmap_pos.xy);

	if(v_lightmap_pos.x < 0.0 || v_lightmap_pos.x > 1.0 || v_lightmap_pos.y < 0.0 || v_lightmap_pos.y > 1.0)
		return false;

	return tc.w == 1.0 && tc.x + shadow_fudge_factor < v_lightmap_pos.z;
}

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

	if(lambertian > 0.0) {
		vec3 view_direction = normalize(u_camera);

		vec3 half_dir = normalize(light_direction + view_direction);

		float spec_angle = max(dot(half_dir, normal), 0.0);
		power = pow(spec_angle, u_shininess);
	}

	return u_specular * power;
}

void main() {
	vec3 color_linear;

	if(is_in_shadow())
		color_linear = vec3(u_emissive) + compute_ambient();
	else
		color_linear = vec3(u_emissive) + compute_ambient() + compute_diffuse() + compute_specular();
	vec3 color_gamma_corrected = pow(color_linear, vec3(1.0/screen_gamma));

	gl_FragColor = vec4(color_gamma_corrected.xyz, 1);
}
