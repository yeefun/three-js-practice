import * as THREE from '../../../../node_modules/three/build/three.module.js'
import Stats from '../../../../node_modules/three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from '../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

let container
let scene
let camera
let spotLight
let renderer
let mixer
let clock
let controls
let stats

init()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

  clock = new THREE.Clock()

  stats = new Stats()
  container.appendChild(stats.dom)

  // scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x8694a7)

  // camera
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 400)
  // console.log(THREE.Math.degToRad(camera.fov), camera.fov)
  camera.position.set(20, -20, 50)
  camera.lookAt(scene.position)

  // renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
    // logarithmicDepthBuffer: true
  })
  // renderer.physicallyCorrectLight = true
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)
  // renderer.outputEncoding = THREE.sRGBEncoding

  // loader
  const loader = new GLTFLoader()
  loader.load(`${pathname}/assets/models/gltf/prison-door.glb`, function (gltf) {
    // console.log(gltf)
    const model = gltf.scene
    // model.scale.set(0.01, 0.01, 0.01)
    // camera = gltf.cameras[0]
    // camera.updateProjectionMatrix()
    // mixer = new THREE.AnimationMixer(model)
    // gltf.animations.forEach((clip) => {
    //   mixer.clipAction(clip).play()
    // })
    // model.traverse((child) => {
    //   if (child.material) child.material.metalness = 0
    // })

    scene.add(model)
    const box = new THREE.Box3().setFromObject(model)
    console.log(box);
    
    const boxSize = box.getSize(new THREE.Vector3()).length()
    const boxCenter = box.getCenter(new THREE.Vector3())
    console.log(box.getSize(new THREE.Vector3()));
    
    // console.log(boxSize)
    // console.log(boxCenter)
    frameArea(boxSize, boxSize, boxCenter, camera)
    // console.log(dumpObject(model).join('\n'))
    animate()
  })

  // light
  scene.add(new THREE.AmbientLight())

  spotLight = new THREE.SpotLight(0xffffff, 1)
  spotLight.position.set(-100, 100, 100)
  // spotLight.castShadow = true
  scene.add(spotLight)

  // controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.5, 0)
  controls.update()

  // helper
  // const axesHelper = new THREE.AxesHelper(20)
  // scene.add(axesHelper)

  // const cameraHelper = new THREE.CameraHelper(camera)
  // scene.add(cameraHelper)

  // resize
  window.addEventListener('resize', handleWindowResize)
}

function animate() {
  const delta = clock.getDelta()
  // mixer.update(delta)
  stats.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function frameArea (sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
  const halfFovY = THREE.Math.degToRad(camera.fov * 0.5)
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)

  // compute a unit vector that points in the direction the camera is now from the center of the box
  const direction = new THREE.Vector3()
    .subVectors(camera.position, boxCenter)
    // in the xz plane
    // .multiply(new THREE.Vector3(1, 0, 1))
    .normalize()

  // move the camera to a position distance units way from the center in whatever direction the camera was from the center already  
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))

  // pick some near and far values for the frustum that will contain the box.
  camera.near = boxSize / 100
  camera.far = boxSize * 100

  camera.updateProjectionMatrix()

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
}

function dumpObject (obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─'
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`)
  const newPrefix = prefix + (isLast ? '  ' : '│ ')
  const lastNdx = obj.children.length - 1
  obj.children.forEach((child, ndx) => {
    const isLast = (ndx === lastNdx)
    dumpObject(child, lines, isLast, newPrefix)
  })
  return lines
}
