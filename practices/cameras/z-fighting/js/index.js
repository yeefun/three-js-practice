// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GUI } from '../../../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

const gui = new GUI()
const canvas = document.getElementById('mycanvas')

let camera
let renderer
let scene
let controls

init()

function init () {
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.00001, 100)
  camera.position.set(10, 6, 10)

  renderer = new THREE.WebGLRenderer({
    canvas,
    // logarithmicDepthBuffer: true
  })
  resizeRendererToDisplaySize()
  function resizeRendererToDisplaySize () {
    const pixelRatio = window.devicePixelRatio
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    renderer.setSize(width, height, false)
  }

  scene = new THREE.Scene()
  scene.background = new THREE.Color('black')

  {
    // texture
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load(`${pathname}/assets/textures/checker.png`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    // object
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)
  }
  {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const numSpheres = 20
    for (let i = 0; i < numSpheres; i += 1) {
      const sphereMat = new THREE.MeshPhongMaterial()
      sphereMat.color.setHSL(i * .73, 1, 0.5)
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * sphereRadius * -2.2)
      scene.add(mesh)
    }
  }

  // light
  const color = 0xffffff
  const intensity = 1
  const directionalLight = new THREE.DirectionalLight(color, intensity)
  directionalLight.position.set(0, 10, 0)
  directionalLight.target.position.set(-5, 0, 0)
  scene.add(directionalLight)
  scene.add(directionalLight.target)

  // gui
  function updateCamera () {
    camera.updateProjectionMatrix()
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

  gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
  gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near').onChange(updateCamera)
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)

  // controls
  controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()

  const axesHelper = new THREE.AxesHelper(16)
  scene.add(axesHelper)

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
