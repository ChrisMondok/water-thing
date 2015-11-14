function loadMesh(url) {
	return http.get(url).then(parseObj).then(convertToMesh);
}

function parseObj(data) {
	var objData = {
		vertices: [],
		normals: [],
		texcoords: [],
		faces: []
	};

	if("groupCollapsed" in console)
		console.groupCollapsed("Parsing obj");

	data.split(/\r?\n/).forEach(handleLine);

	if("groupCollapsed" in console)
		console.groupEnd();

	function handleLine(line) {
		var words = line.split('#')[0].trim().split(/\s+/);
		switch(words[0]) {
			case '':
			case undefined:
				return;
			case 'v':
				addVertex(words);
				break;
			case 'vn':
				addNormal(words);
				break;
			case 'f':
				addFace(words);
				break;
			case 'o':
				console.info("Found object %s", words.slice(1).join(' '));
				break;
			default:
				console.warn("Unrecognized obj directive %s", words[0]);
				return;
		}
	}

	//v x y z [w]
	function addVertex(words) {
		if(words.length > 4)
			console.warn("Discarding w coordinate.");
		objData.vertices.push([Number(words[1]), Number(words[2]), Number(words[3])]);
	}

	//vn x y z
	function addNormal(words) {
		objData.normals.push([Number(words[1]), Number(words[2]), Number(words[3])]);
	}

	//vt u v [w]
	function addTexCoord(words) {
		console.warn("Texture coordinates not implemented");
	}

	function addFace(words) {
		words.shift();
		var face = {v: [], t: [], n: []};
		words.forEach(function(word) {
			var parts = word.split('/');
			face.v.push(parts[0] - 1);
			face.t.push(parts[1] - 1);
			face.n.push(parts[2] - 1);
		});
		objData.faces.push(face);
	}

	return objData;
}

function convertToMesh(obj) {
	var verts = [];
	var norms = [];
	
	obj.faces.forEach(function(face) {
		//convert a triangle fan into a list of triangles
		for(var i = 2; i < face.v.length; i++) {
			addVert(face.v[0]);
			addNorm(face.n[0]);
			addVert(face.v[i - 1]);
			addNorm(face.n[i - 1]);
			addVert(face.v[i]);
			addNorm(face.n[i]);
		}
	});

	function addVert(vertIndex) {
		verts.push(obj.vertices[vertIndex][0], obj.vertices[vertIndex][1], obj.vertices[vertIndex][2]);
	}

	function addNorm(normIndex) {
		norms.push(obj.normals[normIndex][0], obj.normals[normIndex][1], obj.normals[normIndex][2]);
	}

	return {
		vertices: new Float32Array(verts),
		normals: new Float32Array(norms)
	};
}
