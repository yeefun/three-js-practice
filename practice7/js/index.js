// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../node_modules/three/build/three.module.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

const cubes = []
// const gui = new GUI()
let camera
let renderer
let scene
// let controls

init()

function init () {
  const canvas = document.getElementById('mycanvas')

  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 5)
  camera.position.z = 2

  renderer = new THREE.WebGLRenderer({ canvas })
  resizeRendererToDisplaySize()
  function resizeRendererToDisplaySize () {
    const pixelRatio = window.devicePixelRatio
    // what is “| 0”?
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    renderer.setSize(width, height, false)
  }

  scene = new THREE.Scene()

  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

  /**
   * One texture
   */
  // const loader = new THREE.TextureLoader()
  // const material = new THREE.MeshBasicMaterial({
  //   map: loader.load(`${pathname}/assets/textures/wall.jpg`)
  // })
  // const cube = new THREE.Mesh(geometry, material)
  // scene.add(cube)
  // cubes.push(cube)

  /**
   * Six textures
   */
  // const loader = new THREE.TextureLoader()
  // const materials = [
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-1.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-2.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-3.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-4.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-5.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-6.jpg`)})
  // ]
  // const cube = new THREE.Mesh(geometry, materials)
  // scene.add(cube)
  // cubes.push(cube)

  /**
   * Load one texture
   */
  // const loader = new THREE.TextureLoader()
  // loader.load(`${pathname}/assets/textures/wall.jpg`, (texture) => {
  //   const material = new THREE.MeshBasicMaterial({
  //     map: texture
  //   })
  //   const cube = new THREE.Mesh(geometry, material)
  //   scene.add(cube)
  //   cubes.push(cube)
  // })

  /**
   * Load multiple textures
   */
  // const loadManager = new THREE.LoadingManager()
  // const loader = new THREE.TextureLoader(loadManager)
  // const materials = [
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-1.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-2.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-3.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-4.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-5.jpg`)}),
  //   new THREE.MeshBasicMaterial({map: loader.load(`${pathname}/assets/textures/flower-6.jpg`)})
  // ]

  // const loadingElem = document.querySelector('#loading')
  // const progressBarElem = loadingElem.querySelector('.progressbar')

  // loadManager.onLoad = () => {
  //   loadingElem.style.display = 'none';
  //   const cube = new THREE.Mesh(geometry, materials)
  //   scene.add(cube)
  //   cubes.push(cube)
  // }

  // loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  //   const progress = itemsLoaded / itemsTotal
  //   progressBarElem.style.transform = `scaleX(${progress})`
  // }

  /**
   * Repeating, offseting, rotating, wrapping a texture
   */
  const loader = new THREE.TextureLoader()
  const texture = loader.load(`${pathname}/assets/textures/wall.jpg`)
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  cubes.push(cube)

  class DegRadHelper {
    constructor (obj, prop) {
      this.obj = obj
      this.prop = prop
    }
    get value () {
      return THREE.Math.radToDeg(this.obj[ this.prop ])
    }
    set value (v) {
      this.obj[ this.prop ] = THREE.Math.degToRad(v)
    }
  }

  class StringToNumberHelper {
    constructor (obj, prop) {
      this.obj = obj
      this.prop = prop
    }
    get value() {
      return this.obj[ this.prop ]
    }
    set value(v) {
      this.obj[ this.prop ] = parseFloat(v)
    }
  }

  const wrapModes = {
    'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
    'RepeatWrapping': THREE.RepeatWrapping,
    'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping
  }

  function updateTexture() {
    texture.needsUpdate = true
  }

  const gui = new GUI()
  gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
    .name('texture.wrapS')
    .onChange(updateTexture)
  gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
    .name('texture.wrapT')
    .onChange(updateTexture)
  gui.add(texture.repeat, 'x', 0, 5, .01).name('texture.repeat.x')
  gui.add(texture.repeat, 'y', 0, 5, .01).name('texture.repeat.y')
  gui.add(texture.offset, 'x', -2, 2, .01).name('texture.offset.x')
  gui.add(texture.offset, 'y', -2, 2, .01).name('texture.offset.y')
  gui.add(texture.center, 'x', -.5, 1.5, .01).name('texture.center.x')
  gui.add(texture.center, 'y', -.5, 1.5, .01).name('texture.center.y')
  gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360).name('texture.rotation')

  // handle resize
  window.addEventListener('resize', handleWindowResize)
  function handleWindowResize () {
    resizeRendererToDisplaySize()
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
}

function render (time) {
  time = time * 0.001
  cubes.forEach((cube, idx) => {
    const speed = 0.2 + idx * 0.1
    const rot = time * speed
    cube.rotation.x = rot
    cube.rotation.y = rot
  })
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
