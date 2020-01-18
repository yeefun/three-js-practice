import * as THREE from '/node_modules/three/build/three.module.js'
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js'

let container
let scene
let camera
let spotLight
let renderer
let controls
let stats

init()
animate()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

  stats = new Stats()
  container.appendChild(stats.dom)

  // scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x8694a7)

  // camera
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 400)
  camera.position.set(20, -20, 50)
  camera.lookAt(scene.position)

  // renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // loader
  const loader = new GLTFLoader()
  loader.load('/assets/models/gltf/prison.glb', function (gltf) {
    // console.log(gltf)
    const model = gltf.scene
    // model.position.set(0, 0, 0)
    model.scale.set(0.01, 0.01, 0.01)
    // model.matrixAutoUpdate = false
    // console.log(model.matrix);
    scene.add(model)
  })

  // light
  scene.add(new THREE.AmbientLight())

  spotLight = new THREE.SpotLight(0xffffff, 1.2)
  spotLight.position.set(-100, 100, 100)
  // spotLight.castShadow = true
  scene.add(spotLight)

  // controls
  controls = new OrbitControls(camera, renderer.domElement)
  // controls.target.set(0, 0.5, 0)
  // controls.update()

  // helper
  // const axesHelper = new THREE.AxesHelper(20)
  // scene.add(axesHelper)

  // const cameraHelper = new THREE.CameraHelper(camera)
  // scene.add(cameraHelper)

  // resize
  window.addEventListener('resize', handleWindowResize)
}

function animate() {
  stats.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
