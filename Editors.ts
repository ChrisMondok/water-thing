interface Function {
  name: string
}

namespace Editors {
  export class EnvironmentEditor {
    constructor (world: Game) {
      var container = window.document.createElement('details')

      var summary = window.document.createElement('summary')

      summary.textContent = 'Environment'

      container.appendChild(summary)

      container.appendChild(makeRange('Time of Day', function (v) {
        world.timeOfDay = v
      }, world.timeOfDay, 0, 1))

      container.appendChild(makeRange('Latitude', function (v) {
        world.latitude = v
      }, world.latitude, -90, 90))

      container.appendChild(makeRange('Timescale', function (v) {
        world.timeScale = v
      }, world.timeScale, 0, 2))

      window.document.querySelector('#toolbox')!.appendChild(container)
    }
  }

  export class PointWaveSourceEditor {
    constructor (pointWaveSource: PointWaveSource, name: string) {
      var container = window.document.createElement('details')

      var summary = window.document.createElement('summary')

      summary.textContent = name || 'Point Wave Source'

      container.appendChild(summary)

      container.appendChild(makePositionEditor('Position', pointWaveSource))

      container.appendChild(makeRange('Phase', function (v) {
        pointWaveSource.phase = v
      }, pointWaveSource.phase, 0, 2 * Math.PI))

      container.appendChild(makeRange('Amplitude', function (v) {
        pointWaveSource.amplitude = v
      }, pointWaveSource.amplitude, 0, 50))

      container.appendChild(makeRange('Frequency', function (v) {
        pointWaveSource.frequency = v
      }, pointWaveSource.frequency, 0, 1, 0.01))

      window.document.querySelector('#toolbox')!.appendChild(container)
    }
  }

  export class WaterEditor {
    constructor(water: Water) {
      var container = window.document.createElement('details')

      var summary = window.document.createElement('summary')

      summary.textContent = 'Water'

      container.appendChild(summary)

      container.appendChild(makeRange('viscosity', function (v) {
        water.viscosity = v
      }, water.viscosity, 1, 100))

      window.document.querySelector('#toolbox')!.appendChild(container)

      water.waveSources.forEach(function (source, index) {
        if (source instanceof PointWaveSource) {
          // TODO: get rid of valueOf when these things don't manipulate the doucment directly
          new PointWaveSourceEditor(source, 'Wave source ' + index).valueOf()
        }
      })
    }
  }

  export class MaterialEditor {
    constructor (material: Material, materialName?:string) {
      var container = window.document.createElement('details')

      var summary = window.document.createElement('summary')

      materialName = materialName || material.name || material.constructor.name

      summary.textContent = 'Material Editor (' + materialName + ')'

      if (materialName === 'Material') {
        debugger
      }

      container.appendChild(summary)

      container.appendChild(makeColorPicker('Diffuse', material.diffuse))
      container.appendChild(makeColorPicker('Emissive', material.emissive))
      container.appendChild(makeColorPicker('Ambient', material.ambient))

      container.appendChild(makeColorPicker('Specular', material.specular))
      container.appendChild(makeRange('Shininess', function (v) {
        material.shininess = v
      }, material.shininess, 0, 50, 1))

      window.document.querySelector('#toolbox')!.appendChild(container)
    }
  }

  function makeRange (name: string, callback:(n: number) => void, initialValue = 0.5, min: number = 0, max = 1, step = 0.001) {
    var label = window.document.createElement('label')

    var text = window.document.createElement('span')
    function updateLabel (v: number | string) {
      text.textContent = name + ': ' + v
    }

    label.appendChild(text)

    var input = window.document.createElement('input')
    input.type = 'range'
    input.min = min.toString()
    input.max = max.toString()
    input.step = step.toString()
    input.value = initialValue.toString()

    input.addEventListener('input', function () {
      callback(Number(input.value))
      updateLabel(input.value)
    })

    updateLabel(input.value)

    label.appendChild(input)

    return label
  }

  function makePositionEditor (name: string, model: Actor) {
    var container = window.document.createElement('section')
    var header = window.document.createElement('header')
    header.textContent = name
    container.appendChild(header)

    container.appendChild(makeRange('x', function (x) {
      model.x = x
    }, model.x, -200, 200))
    container.appendChild(makeRange('y', function (y) {
      model.y = y
    }, model.y, -200, 200))
    container.appendChild(makeRange('z', function (z) {
      model.z = z
    }, model.z, -200, 200))

    return container
  }

  function makeColorPicker (name: string, colorArray: Float32Array) {
    var container = window.document.createElement('section')
    var header = window.document.createElement('header')
    header.textContent = name
    container.appendChild(header)

    container.appendChild(makeRange('Red', function (c) {
      colorArray[0] = c
    }, colorArray[0]))
    container.appendChild(makeRange('Green', function (c) {
      colorArray[1] = c
    }, colorArray[1]))
    container.appendChild(makeRange('Blue', function (c) {
      colorArray[2] = c
    }, colorArray[2]))

    return container
  }
}
