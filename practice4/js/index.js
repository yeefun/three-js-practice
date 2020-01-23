// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html

import * as THREE from '../../node_modules/three/build/three.module.js'
import Stats from '../../node_modules/three/examples/jsm/libs/stats.module.js'
import { GUI } from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js'
import { Curves } from '../../node_modules/three/examples/jsm/curves/CurveExtras.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'

let container
let scene
let camera
let renderer
let controls
let stats

let splineCamera
let cameraHelper
let cameraEye

let parent
let tubeGeometry
let mesh

const binormal= new THREE.Vector3()
const normal = new THREE.Vector3()

const pipeSpline = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10),
  new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
  new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
  new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
  new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30),
  new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30),
  new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
  new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20, 10),
  new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10),
  new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10),
  new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10),
  new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
  new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0)
])

const sampleClosedSpline = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -40, -40),
  new THREE.Vector3(0, 40, -40),
  new THREE.Vector3(0, 140, -40),
  new THREE.Vector3(0, 40, 40),
  new THREE.Vector3(0, -40, 40)
])

sampleClosedSpline.curveType = 'catmullrom'
sampleClosedSpline.closed = true

// Keep a dictionary of Curve instances
const splines = {
  GrannyKnot: new Curves.GrannyKnot(),
  HeartCurve: new Curves.HeartCurve(3.5),
  VivianiCurve: new Curves.VivianiCurve(70),
  KnotCurve: new Curves.KnotCurve(),
  HelixCurve: new Curves.HelixCurve(),
  TrefoilKnot: new Curves.TrefoilKnot(),
  TorusKnot: new Curves.TorusKnot(20),
  CinquefoilKnot: new Curves.CinquefoilKnot(20),
  TrefoilPolynomialKnot: new Curves.TrefoilPolynomialKnot(14),
  FigureEightPolynomialKnot: new Curves.FigureEightPolynomialKnot(),
  DecoratedTorusKnot4a: new Curves.DecoratedTorusKnot4a(),
  DecoratedTorusKnot4b: new Curves.DecoratedTorusKnot4b(),
  DecoratedTorusKnot5a: new Curves.DecoratedTorusKnot5a(),
  DecoratedTorusKnot5c: new Curves.DecoratedTorusKnot5c(),
  PipeSpline: pipeSpline,
  SampleClosedSpline: sampleClosedSpline
}

const params = {
  spline: 'GrannyKnot',
  scale: 4,
  extrusionSegments: 100,
  radiusSegments: 3,
  closed: true,
  animationView: false,
  lookAhead: false,
  cameraHelper: false
}

const material = new THREE.MeshLambertMaterial({ color: 0xff00ff })
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true })

function addGeometry (geometry) {
  // 3D shape
  mesh = new THREE.Mesh(geometry, material)
  const wireframe = new THREE.Mesh(geometry, wireframeMaterial)
  mesh.add(wireframe)
  parent.add(mesh)
}

function setScale () {
  mesh.scale.set(params.scale, params.scale, params.scale)
}

function addTube () {
  if (mesh !== undefined) {
    parent.remove(mesh)
    mesh.geometry.dispose()
  }

  const extrudePath = splines[ params.spline ]
  tubeGeometry = new THREE.TubeBufferGeometry(extrudePath, params.extrusionSegments, 2, params.radiusSegments, params.closed)
  addGeometry(tubeGeometry)
  setScale()
}

function animateCamera () {
  cameraHelper.visible = params.cameraHelper
  cameraEye.visible = params.cameraHelper
}

init()
animate()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

  // camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000)
  camera.position.set(0, 50, 500)

  // scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // light
  var light = new THREE.DirectionalLight(0xffffff)
  light.position.set(0, 0, 1)
  scene.add(light)

  // tube
  parent = new THREE.Object3D()
  scene.add(parent)

  splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000)
  parent.add(splineCamera)

  cameraHelper = new THREE.CameraHelper(splineCamera)
  scene.add(cameraHelper)

  addTube()

  // debug camera
  cameraEye = new THREE.Mesh(new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({ color: 0xdddddd }))
  parent.add(cameraEye)

  cameraHelper.visible = params.cameraHelper
  cameraEye.visible = params.cameraHelper

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // dat.GUI
  const gui = new GUI({ width: 300 })
  const folderGeometry = gui.addFolder('Geometry')
  folderGeometry.add(params, 'spline', Object.keys(splines)).onChange(function () {
    addTube()
  })
  folderGeometry.add(params, 'scale', 2, 10).step(2).onChange(function () {
    setScale()
  })
  folderGeometry.add(params, 'extrusionSegments', 50, 500).step(50).onChange(function () {
    addTube()
  })
  folderGeometry.add(params, 'radiusSegments', 2, 12).step(1).onChange(function () {
    addTube()
  })
  folderGeometry.add(params, 'closed').onChange(function () {
    addTube()
  })
  folderGeometry.open()

  const folderCamera = gui.addFolder('Camera')
  folderCamera.add(params, 'animationView').onChange(function () {
    animateCamera()
  })
  folderCamera.add(params, 'lookAhead').onChange(function () {
    animateCamera()
  })
  folderCamera.add(params, 'cameraHelper').onChange(function () {
    animateCamera()
  })
  folderCamera.open()

  // stat
  stats = new Stats()
  container.appendChild(stats.dom)

  controls = new OrbitControls(camera, renderer.domElement)

  // resize
  window.addEventListener('resize', handleWindowResize)
}

function render () {
  // animate camera along spline
  const time = Date.now()
  const loopTime = 20 * 1000
  // 讓 t 一定在 0 ~ 1 之間
  const t = (time % loopTime) / loopTime
  
  const pos = tubeGeometry.parameters.path.getPointAt(t)
  pos.multiplyScalar(params.scale)

  // interpolation
  const segments = tubeGeometry.tangents.length
  const pickt = t * segments
  const pick = Math.floor(pickt)
  const pickNext = (pick + 1) % segments
  
  binormal.subVectors(tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ])
  binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[ pick ])

  const dir = tubeGeometry.parameters.path.getTangent(t)
  const offset = 15
  normal.copy(binormal).cross(dir)

  // we move on a offset on its binormal
  pos.add(normal.clone().multiplyScalar(offset))
  splineCamera.position.copy(pos)
  cameraEye.position.copy(pos)

  // using arclength for stablization in look ahead
  const lookAt = tubeGeometry.parameters.path.getPointAt((t + (30 / tubeGeometry.parameters.path.getLength())) % 1).multiplyScalar(params.scale)

  // camera orientation 2 - up orientation via normal
  if (!params.lookAhead) { lookAt.copy(pos).add(dir) }
  splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal)
  splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix)

  cameraHelper.update()

  renderer.render(scene, params.animationView ? splineCamera : camera)
}

function animate () {
  requestAnimationFrame(animate)
  render()
  stats.update()
}

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
