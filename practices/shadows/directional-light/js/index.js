// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GUI } from '../../../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''
const canvas = document.getElementById('mycanvas')
const gui = new GUI()

let camera
let renderer
let scene
let controls

init()

function init () {
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 10, 20)

  renderer = new THREE.WebGLRenderer({ canvas })
  // NOTE
  renderer.shadowMap.enabled = true

  resizeRendererToDisplaySize()
  function resizeRendererToDisplaySize () {
    const pixelRatio = window.devicePixelRatio
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    renderer.setSize(width, height, false)
  }

  scene = new THREE.Scene()
  scene.background = new THREE.Color('black')

  controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()

  {
    const planeSize = 40

    const loader = new THREE.TextureLoader()
    const texture = loader.load(`${pathname}/assets/textures/checker.png`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    // NOTE
    mesh.receiveShadow = true

    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)
  }
  {
    const cubeSize = 4
    const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'})
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    // NOTE
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
  }
  {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
    const mesh = new THREE.Mesh(sphereGeo, sphereMat)
    // NOTE
    mesh.castShadow = true
    mesh.receiveShadow = true

    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
  }

  class ColorGUIHelper {
    constructor (object, prop) {
      this.object = object
      this.prop = prop
    }
    get value () {
      return `#${this.object[ this.prop ].getHexString()}`
    }
    set value (hexString) {
      this.object[ this.prop ].set(hexString)
    }
  }

  class DimensionGUIHelper {
    constructor (obj, minProp, maxProp) {
      this.obj = obj
      this.minProp = minProp
      this.maxProp = maxProp
    }
    get value () {
      return this.obj[ this.maxProp ] * 2
    }
    set value (v) {
      this.obj[ this.maxProp ] = v / 2
      this.obj[ this.minProp ] = v / -2
    }
  }

  class MinMaxGUIHelper {
    constructor (obj, minProp, maxProp, minDif) {
      this.obj = obj
      this.minProp = minProp
      this.maxProp = maxProp
      this.minDif = minDif
    }
    get min () {
      return this.obj[ this.minProp ]
    }
    set min (v) {
      this.obj[ this.minProp ] = v
      this.obj[ this.maxProp ] = Math.max(this.obj[ this.maxProp ], v + this.minDif)
    }
    get max () {
      return this.obj[ this.maxProp ]
    }
    set max (v) {
      this.obj[ this.maxProp ] = v
      // this will call the min setter
      this.min = this.min
    }
  }

  function makeXYZGUI (gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name)
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
    folder.open()
  }

  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    // NOTE
    light.castShadow = true
    
    light.position.set(0, 10, 0)
    light.target.position.set(-4, 0, -4)
    scene.add(light)
    scene.add(light.target)

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    scene.add(cameraHelper)

    const helper = new THREE.DirectionalLightHelper(light)
    scene.add(helper)

    function updateCamera () {
      // update the light target's matrixWorld because it's needed by the helper
      light.target.updateMatrixWorld()
      helper.update()
      // update the light's shadow camera's projection matrix
      light.shadow.camera.updateProjectionMatrix()
      // and now update the camera helper we're using to show the light's shadow camera
      cameraHelper.update()
    }
    updateCamera()

    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    gui.add(light, 'intensity', 0, 2, 0.01)

    {
      const folder = gui.addFolder('Shadow Camera')
      folder.open()
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100)
        .name('width')
        .onChange(updateCamera)
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100)
        .name('height')
        .onChange(updateCamera)
      const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1)
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
      folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera)
    }

    makeXYZGUI(gui, light.position, 'position', updateCamera)
    makeXYZGUI(gui, light.target.position, 'target', updateCamera)
  }

  // handle resize
  window.addEventListener('resize', handleWindowResize)
  function handleWindowResize () {
    resizeRendererToDisplaySize()
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
}

function render () {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
