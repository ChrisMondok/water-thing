function loadMtl(path, fileName) {
	return http.get([path, fileName].join('/')).then(parseMaterials);
}

function parseMaterials(materialDefinition) {
	var mtllib = [];
	var currentMaterial = null;

	if("groupCollapsed" in console)
		console.groupCollapsed("Parsing mtl");

	materialDefinition.split(/\r?\n/).forEach(handleLine);

	if("groupCollapsed" in console)
		console.groupEnd();

	return mtllib;

	function addMaterial(name) {
		console.info("New material %s", name);

		var material = new Material();

		material.name = name;
		material.emissive = new Float32Array([0, 0, 0]);

		currentMaterial = material;

		mtllib.push(material);
	}

	function handleLine(line) {
		var words = line.split('#')[0].trim().split(/\s+/);
		switch(words[0]) {
			case '':
			case undefined:
				return;
			case 'newmtl':
				addMaterial(line.replace(/\w+\s+/,''));
				return;
			case 'Kd':
				setDiffuse(words);
				return;
			case 'Ke': //not in MTL spec, but blender uses it, and I want it.
				setEmissive(words);
				return;
			case 'Ks':
				setSpecular(words);
				return;
			case 'Ka':
				console.warn("Ambient color not supported.");
				return;
			case 'Ns':
				setShininess(words);
				return;
			default:
				console.warn("Unrecognized mtl directive %s", words[0]);
				return;
		}
	}

	//Kd r g b
	function setDiffuse(words) {
		if(words.length != 4)
			throw new Error("Unrecognized Kd directive");
		currentMaterial.diffuse = new Float32Array(words.slice(1));
	}

	//Ke r g b
	function setEmissive(words) {
		if(words.length != 4)
			throw new Error("Unrecognized Ke directive");
		currentMaterial.emissive = new Float32Array(words.slice(1));
	}

	//Ks r g b
	function setSpecular(words) {
		if(words.length != 4)
			throw new Error("Unrecognized Ks directive");
		currentMaterial.specular = new Float32Array(words.slice(1));
	}

	//Ns s
	function setShininess(words) {
		if(words.length != 2)
			throw new Error("Unrecognized Ke directive");
		currentMaterial.shininess = Number(words[1]);
	}
}