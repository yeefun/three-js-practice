// https://threejs.org/examples/#webgl_animation_keyframes

import * as THREE from '../../node_modules/three/build/three.module.js'
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import Stats from '../../node_modules/three/examples/jsm/libs/stats.module.js'

let container
let scene
let camera
let pointLight
let renderer
let controls
let mixer
let clock
let stats

init()

function init () {
  clock = new THREE.Clock()
  container = document.getElementById('container')
  stats = new Stats()
  container.appendChild(stats.dom)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfe3dd)

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
  camera.position.set(5, 2, 8)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.5, 0)
  controls.update()
  // controls.enablePan = false

  // const axesHelper = new THREE.AxesHelper(20)
  // scene.add(axesHelper)
  
  // const cameraHelper = new THREE.CameraHelper(camera)
  // scene.add(cameraHelper)

  scene.add(new THREE.AmbientLight(0x404040))

  pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.copy(camera.position)
  scene.add(pointLight)

  // var path = 'textures/cube/Park2/'
  // var format = '.jpg'
  // var envMap = new THREE.CubeTextureLoader().load([
  //   path + 'posx' + format, path + 'negx' + format,
  //   path + 'posy' + format, path + 'negy' + format,
  //   path + 'posz' + format, path + 'negz' + format
  // ])

  // ???
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../../node_modules/three/examples/js/libs/draco/gltf/')
  // ???

  const loader = new GLTFLoader()
  // ???
  loader.setDRACOLoader(dracoLoader)
  // ???
  loader.load('../../assets/models/gltf/LittlestTokyo.glb', function (gltf) {
    // console.log(gltf)
    
    const model = gltf.scene
    model.position.set(0, 1, 0)
    model.scale.set(0.01, 0.01, 0.01)
    // model.traverse(function (child) {
    //   if (child.isMesh) child.material.envMap = envMap
    // })
    scene.add(model)
    // mixer = new THREE.AnimationMixer(model)
    // mixer.clipAction(gltf.animations[0]).play()

    animate()
  }, undefined, function (e) {
    console.error(e)
  })

  window.addEventListener('resize', handleWindowResize)
}

function animate () {
  const delta = clock.getDelta()
  // mixer.update(delta)
  // controls.update(delta)
  stats.update()

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
