/* globals loadMtl, self */

(function (global) {
  global.loadMesh = loadMesh

  function loadMesh (path, fileName) {
    return fetch([path, fileName].join('/'))
      .then(function (response) { return response.text() })
      .then(parseObj).then(function (objData) {
        return loadMaterials(path, objData)
      }).then(convertToMesh)
  }

  function parseObj (data) {
    var objData = {
      vertices: [],
      normals: [],
      objects: [],
      mtllibs: [],
      materials: {}
    }

    var currentObject = null

    function addObject (name, mtllib) {
      console.info('New object %s', name)
      var object = {
        name: name,
        material: undefined,
        faces: []
      }

      objData.objects.push(object)

      currentObject = object
    }

    if ('groupCollapsed' in console) console.groupCollapsed('Parsing obj')

    data.split(/\r?\n/).forEach(handleLine)

    if ('groupCollapsed' in console) console.groupEnd()

    function handleLine (line) {
      var words = line.split('#')[0].trim().split(/\s+/)
      switch (words[0]) {
        case '':
        case undefined:
          return
        case 'v':
          addVertex(words)
          break
        case 'vn':
          addNormal(words)
          break
        case 'vt':
          addTexCoord(words)
          break
        case 'f':
          addFace(words)
          break
        case 'o':
          addObject(line.replace(/^o\s+/, '')) // ugh, I don't know if we'll get spaces in here.
          break
        case 'usemtl':
          setMaterial(words)
          break
        case 'g':
          console.info('Found group %s', words.slice(1).join(' '))
          break
        case 'mtllib':
          addMtllib(words)
          break
        default:
          console.warn('Unrecognized obj directive %s', words[0])
      }
    }

    // v x y z [w]
    function addVertex (words) {
      if (words.length > 4) console.warn('Discarding w coordinate.')
      objData.vertices.push([Number(words[1]), Number(words[2]), Number(words[3])])
    }

    // vn x y z
    function addNormal (words) {
      objData.normals.push([Number(words[1]), Number(words[2]), Number(words[3])])
    }

    // vt u v [w]
    function addTexCoord (words) {
      console.warn('Texture coordinates not implemented')
    }

    // mtllib file_name
    function addMtllib (words) {
      if (words.length !== 2) console.error('Unrecognized mtllib directive.')
      var name = words[1]
      console.info('Found mtllib %s', name)
      objData.mtllibs.push(name)
    }

    function setMaterial (words) {
      if (!currentObject) {
        console.warn('Setting material before object declared. Creating anonymous object.')
        addObject(undefined)
      }

      console.info('Object %s uses material %s', currentObject.name, words[1])
      currentObject.material = words[1]
    }

    function addFace (words) {
      if (!currentObject) {
        console.warn('Adding faces before object declared. Creating anonymous object.')
        addObject(undefined)
      }

      words.shift()
      var face = {v: [], t: [], n: []}
      words.forEach(function (word) {
        var parts = word.split('/')
        face.v.push(parts[0] - 1)
        face.t.push(parts[1] - 1)
        face.n.push(parts[2] - 1)
      })
      currentObject.faces.push(face)
    }

    console.log('Obj loaded with %d vertices and %d objects', objData.vertices.length, objData.objects.length)

    return objData
  }

  function loadMaterials (path, objData) {
    return Promise.all(objData.mtllibs.map(function (mtllib) {
      return loadMtl(path, mtllib)
    })).then(function (libs) {
      libs.forEach(function (lib) {
        lib.forEach(function (material) {
          if (material.name in objData) {
            console.error('Duplicate material definition for %s', material.name)
          }
          objData.materials[material.name] = material
        })
      })
      return objData
    })
  }

  function convertToMesh (objData) {
    function constructObject (object) {
      var verts = []
      var norms = []

      object.faces.forEach(function (face) {
        // convert a triangle fan into a list of triangles
        for (var i = 2; i < face.v.length; i++) {
          addVert(face.v[0])
          addNorm(face.n[0])
          addVert(face.v[i - 1])
          addNorm(face.n[i - 1])
          addVert(face.v[i])
          addNorm(face.n[i])
        }
      })

      function addVert (vertIndex) {
        verts.push(objData.vertices[vertIndex][0], objData.vertices[vertIndex][1], objData.vertices[vertIndex][2])
      }

      function addNorm (normIndex) {
        norms.push(objData.normals[normIndex][0], objData.normals[normIndex][1], objData.normals[normIndex][2])
      }

      console.log('Object %s created with %d faces and %d vertices', object.name, object.faces.length, verts.length)

      return {
        name: object.name,
        vertices: new Float32Array(verts),
        normals: new Float32Array(norms),
        material: objData.materials[object.material]
      }
    }

    return objData.objects.map(constructObject)
  }
})(typeof window === 'undefined' ? self : window)
