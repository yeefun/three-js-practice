// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GUI } from '../../../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

const gui = new GUI()
const canvas = document.getElementById('mycanvas')
const view1Elem = document.getElementById('view1')
const view2Elem = document.getElementById('view2')

let camera1
let camera2
let renderer
let scene
let controls1
let controls2
let cameraHelper

function setScissorForElement (elem) {
  const canvasRect = canvas.getBoundingClientRect()
  const elemRect = elem.getBoundingClientRect()

  // compute a canvas relative rectangle
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
  const left = Math.max(0, elemRect.left - canvasRect.left)
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
  const top = Math.max(0, elemRect.top - canvasRect.top)

  const width = Math.min(canvasRect.width, right - left)
  const height = Math.min(canvasRect.height, bottom - top)

  // setup the scissor to only render to that part of the canvas
  const positiveYUpBottom = canvasRect.height - bottom
  renderer.setScissor(left, positiveYUpBottom, width, height)
  renderer.setViewport(left, positiveYUpBottom, width, height)

  // return the aspect
  return width / height
}

init()

function init () {
  camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1, 5, 50)
  // camera1.zoom = 0.2
  camera1.position.set(0, 10, 20)

  camera2 = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 500)
  camera2.position.set(40, 10, 30)
  camera2.lookAt(0, 5, 0)

  renderer = new THREE.WebGLRenderer({ canvas })
  resizeRendererToDisplaySize()
  function resizeRendererToDisplaySize () {
    // const pixelRatio = window.devicePixelRatio
    // const width = canvas.clientWidth * pixelRatio | 0
    // const height = canvas.clientHeight * pixelRatio | 0
    const width = canvas.clientWidth
    const height = canvas.clientHeight
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
    const cubeSize = 4
    const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
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
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
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
  // function updateCamera () {
  //   camera1.updateProjectionMatrix()
  // }

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

  gui.add(camera1, 'zoom', 0.01, 1, 0.01).listen()
  const minMaxGUIHelper = new MinMaxGUIHelper(camera1, 'near', 'far', 0.1)
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')

  // controls
  controls1 = new OrbitControls(camera1, view1Elem)
  controls1.target.set(0, 5, 0)
  controls1.update()

  controls2 = new OrbitControls(camera2, view2Elem)
  controls2.target.set(0, 5, 0)
  controls2.update()

  cameraHelper = new THREE.CameraHelper(camera1)
  scene.add(cameraHelper)

  const axesHelper = new THREE.AxesHelper(16)
  scene.add(axesHelper)

  // handle resize
  window.addEventListener('resize', handleWindowResize)
  function handleWindowResize () {
    resizeRendererToDisplaySize()
    // camera1.aspect = canvas.clientWidth / canvas.clientHeight
    // camera1.updateProjectionMatrix()
  }
}

function render () {
  // turn on the scissor
  renderer.setScissorTest(true)

  // render the original view
  {
    const aspect = setScissorForElement(view1Elem)

    // adjust the camera for this aspect
    camera1.left = -aspect
    camera1.right = aspect
    camera1.updateProjectionMatrix()
    cameraHelper.update()

    // don't draw the camera helper in the original view
    cameraHelper.visible = false

    scene.background.set(0x000000)

    // render
    renderer.render(scene, camera1)
  }

  // render from the 2nd camera
  {
    const aspect = setScissorForElement(view2Elem)

    // adjust the camera for this aspect
    camera2.aspect = aspect
    camera2.updateProjectionMatrix()

    // draw the camera helper in the 2nd view
    cameraHelper.visible = true

    scene.background.set(0x000040)

    renderer.render(scene, camera2)
  }
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
