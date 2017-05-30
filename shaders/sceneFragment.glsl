precision mediump float;

uniform vec3 u_ambient_light;
uniform vec3 u_sun;
uniform vec3 u_camera;

uniform sampler2D u_lightmap_sampler;

uniform vec3 u_mat_diffuse;
uniform vec3 u_mat_emissive;
uniform vec3 u_mat_specular;
uniform vec3 u_mat_ambient;
uniform float u_mat_shininess;

varying vec3 v_vertex_normal;
varying vec3 v_vertex_pos;
varying vec3 v_lightmap_pos;

const float screen_gamma = 2.2;

const float shadow_fudge_factor = 0.005;

float get_light() {
	float sum = 0.0;
	const float pcf_size = 4.0;

	if(texture2D(u_lightmap_sampler, v_lightmap_pos.xy).a != 1.0)
		return 1.0;

	for(float pcf_x=-(pcf_size-1.0)/2.0; pcf_x <= (pcf_size-1.0)/2.0; pcf_x += 1.0)
		for(float pcf_y=-(pcf_size-1.0)/2.0; pcf_y <= (pcf_size-1.0)/2.0; pcf_y += 1.0)
			sum += texture2D(u_lightmap_sampler, v_lightmap_pos.xy).r;

	sum /= (pcf_size * pcf_size);

	return 1.0 - smoothstep(0.001, 0.02, v_lightmap_pos.z - sum);
}

mediump float compute_lambertian() {
	if(u_sun.z < 0.0)
		return 0.0;
	return max(dot(normalize(v_vertex_normal), u_sun), 0.0);
}

mediump vec3 compute_diffuse() {
	return u_mat_diffuse * compute_lambertian();
}

mediump vec3 compute_ambient() {
	return u_mat_diffuse * u_mat_ambient * u_ambient_light;
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
		power = pow(spec_angle, u_mat_shininess);
	}

	return u_mat_specular * power;
}

void main() {
	vec3 color;

	float l = get_light();

	color = vec3(u_mat_emissive) + compute_ambient() + l * (compute_diffuse() + compute_specular());

	gl_FragColor = vec4(pow(color, vec3(1.0/screen_gamma)), 1);
}
