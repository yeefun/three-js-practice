import * as THREE from '../../node_modules/three/build/three.module.js'
import Stats from '../../node_modules/three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'

let container
let scene
let camera
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

  // camera
  // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  // renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // controls
  controls = new OrbitControls(camera, renderer.domElement)
  // controls.target.set(0, 0.5, 0)
  // controls.update()

  // helper
  const axesHelper = new THREE.AxesHelper(20)
  scene.add(axesHelper)

  // resize
  window.addEventListener('resize', handleWindowResize)
}

function animate() {
  requestAnimationFrame(animate)
  stats.update()
  renderer.render(scene, camera)
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
