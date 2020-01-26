// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GUI } from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

const objects = []
const gui = new GUI()
let camera
let renderer
let scene
let controls

init()

function init () {
  const canvas = document.getElementById('mycanvas')

  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 10, 20)
  // camera.up.set(0, 0, 1)
  // camera.lookAt(0, 0, 0)

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

  // texture
  const planeSize = 40
  const loader = new THREE.TextureLoader()
  const texture = loader.load(`${pathname}/assets/textures/checker.png`)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.mapFilter = THREE.NearestFilter
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
  // ambientLight
  // const color = 0xffffff
  // const intensity = 1
  // const ambientLight = new THREE.AmbientLight(color, intensity)
  // scene.add(ambientLight)

  // hemisphereLight
  // const skyColor = 0xb1e1ff
  // const groundColor = 0xB97a20
  // const intensity = 1
  // const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity)
  // scene.add(hemisphereLight)

  // directionalLight
  // const color = 0xffffff
  // const intensity = 1
  // const directionalLight = new THREE.DirectionalLight(color, intensity)
  // directionalLight.position.set(0, 10, 0)
  // directionalLight.target.position.set(-5, 0, 0)
  // scene.add(directionalLight)
  // scene.add(directionalLight.target)
  
  // pointLight
  // const color = 0xffffff
  // const intensity = 1
  // const pointLight = new THREE.PointLight(color, intensity)
  // pointLight.position.set(0, 10, 0)
  // scene.add(pointLight)

  // spotLight
  const color = 0xffffff
  const intensity = 1
  const spotLight = new THREE.SpotLight(color, intensity)
  spotLight.position.set(0, 10, 0)
  spotLight.target.position.set(-5, 0, 0)
  scene.add(spotLight)
  scene.add(spotLight.target)

  // gui
  class ColorGUIHelper {
    constructor (obj, prop) {
      this.obj = obj
      this.prop = prop
    }
    get value () {
      return `#${this.obj[ this.prop ].getHexString()}`
    }
    set value (hexString) {
      this.obj[ this.prop ].set(hexString)
    }
  }

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

  function makeXYZGUI (gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name)
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
    folder.open()
  }

  // ambientLight
  // gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color')
  // gui.add(ambientLight, 'intensity', 0, 2, 0.01)

  // hemisphereLight
  // gui.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('skyColor')
  // gui.addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value').name('groundColor')
  // gui.add(hemisphereLight, 'intensity', 0, 2, 0.01)

  // directionalLight
  // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
  // scene.add(directionalLightHelper)

  // gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color')
  // gui.add(directionalLight, 'intensity', 0, 2, 0.01)

  // function updateLight () {
  //   directionalLight.target.updateMatrixWorld()
  //   directionalLightHelper.update()
  // }
  // updateLight()

  // makeXYZGUI(gui, directionalLight.position, 'position', updateLight)
  // makeXYZGUI(gui, directionalLight.target.position, 'target', updateLight)

  // pointLight
  // const pointLightHelper = new THREE.PointLightHelper(pointLight)
  // scene.add(pointLightHelper)

  // function updateLight() {
  //   pointLightHelper.update()
  // }

  // gui.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color')
  // gui.add(pointLight, 'intensity', 0, 2, 0.01)
  // gui.add(pointLight, 'distance', 0, 40).onChange(updateLight)

  // makeXYZGUI(gui, pointLight.position, 'position', updateLight)

  // spotLight
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)

  function updateLight () {
    spotLight.target.updateMatrixWorld()
    spotLightHelper.update()
  }
  updateLight()

  gui.addColor(new ColorGUIHelper(spotLight, 'color'), 'value').name('color')
  gui.add(spotLight, 'intensity', 0, 2, 0.01)
  gui.add(spotLight, 'distance', 0, 40).onChange(updateLight)
  gui.add(new DegRadHelper(spotLight, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight)
  gui.add(spotLight, 'penumbra', 0, 1, 0.01)
  gui.add(spotLight, 'decay', 0, 5, 0.1)

  // controls
  controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()

  // const axesHelper = new THREE.AxesHelper(16)
  // scene.add(axesHelper)

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
  objects.forEach((obj) => {
    obj.rotation.y = time
  })
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
