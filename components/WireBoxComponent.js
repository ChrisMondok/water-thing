function WireBoxComponent(material) {
	MeshComponent.apply(this, arguments);

	this.drawMode = gl.LINES;
}

WireBoxComponent.prototype = Object.create(MeshComponent.prototype);
WireBoxComponent.prototype.constructor = MeshComponent;

WireBoxComponent.prototype.createMesh = function() {
	var verts = [];
	var norms = [];

	var bottom = {
		back: {
			left: [-1, -1, -1],
			right: [1, -1, -1]
		},
		front: {
			left: [-1, 1, -1],
			right: [1, 1, -1]
		}
	};

	var top = {
		back: {
			left: [-1, -1, 1],
			right: [1, -1, 1]
		},
		front: {
			left: [-1, 1, 1],
			right: [1, 1, 1]
		}
	};

	[top, bottom].forEach(function(ring) {
		verts = verts.concat(ring.back.left);
		verts = verts.concat(ring.back.right);

		verts = verts.concat(ring.back.right);
		verts = verts.concat(ring.front.right);

		verts = verts.concat(ring.front.right);
		verts = verts.concat(ring.front.left);

		verts = verts.concat(ring.front.left);
		verts = verts.concat(ring.back.left);
	});

	['front','back'].forEach(function(y) {
		['left','right'].forEach(function(x) {
			verts = verts.concat(bottom[y][x]);
			verts = verts.concat(top[y][x]);
		});
	});

	return {
		vertices: new Float32Array(verts),
		normals: new Float32Array(verts) //normals for wireframes? IDK.
	};
};
