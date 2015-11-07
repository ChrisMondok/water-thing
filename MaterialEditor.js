function MaterialEditor(material, materialName) {
	var container = document.createElement('details');

	var summary = document.createElement('summary');

	materialName = materialName || material.constructor.name;

	summary.textContent = "Material Editor ("+material.constructor.name+")";

	container.appendChild(summary);

	container.appendChild(makeRange('Reflectivity', function(v) {
		material.reflectivity = v;
	}, material.reflectivity));

	container.appendChild(makeRange('Shininess', function(v) {
		material.shininess = v;
	}, material.shininess, 0, 50, 1));

	container.appendChild(makeColorPicker('Diffuse', material.diffuse));
	container.appendChild(makeColorPicker('Emissive', material.emissive));

	document.querySelector('#toolbox').appendChild(container);
}

function makeRange(name, callback, initialValue, min, max, step) {
	var label = document.createElement('label');

	var text = document.createElement('span');
	function updateLabel(v) {
		text.textContent = name+": "+v;
	}

	label.appendChild(text);

	var input = document.createElement('input');
	input.type = 'range';
	input.min = min === undefined ? 0 : min;
	input.max = max === undefined ? 1 : max;
	input.step = step === undefined ? 0.001 : step;
	input.value = initialValue === undefined ? 0.5 : initialValue;

	input.addEventListener('input', function() {
		callback(Number(input.value));
		updateLabel(input.value);
	});

	updateLabel(input.value);

	label.appendChild(input);

	return label;
}

function makeColorPicker(name, colorArray) {
	var container = document.createElement('section');
	var header = document.createElement('header');
	header.textContent = name;
	container.appendChild(header);

	container.appendChild(makeRange('Red', function(c) {
		colorArray[0] = c;
	}, colorArray[0]));
	container.appendChild(makeRange('Green', function(c) {
		colorArray[1] = c;
	}, colorArray[1]));
	container.appendChild(makeRange('Blue', function(c) {
		colorArray[2] = c;
	}, colorArray[2]));

	return container;
}