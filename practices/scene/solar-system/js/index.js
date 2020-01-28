// https://threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html

import * as THREE from '../../../../node_modules/three/build/three.module.js'
import { GUI } from '../../../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const objects = []
const gui = new GUI()
let camera
let renderer
let scene

init()

function init () {
  const canvas = document.getElementById('mycanvas')

  camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.position.set(0, 50, 0)
  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)

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

  // light
  const pointLight = new THREE.PointLight(0xffffff, 3)
  scene.add(pointLight)

  // object
  // solar system
  const solarSystem = new THREE.Object3D()
  scene.add(solarSystem)
  objects.push(solarSystem)

  // sun
  const sphereGeometry = new THREE.SphereBufferGeometry(1, 6, 6)
  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
  sunMesh.scale.set(5, 5, 5)
  solarSystem.add(sunMesh)
  objects.push(sunMesh)

  // earth orbit
  const earthOrbit = new THREE.Object3D()
  earthOrbit.position.x = 10
  solarSystem.add(earthOrbit)
  objects.push(earthOrbit)

  // earth
  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x12244 })
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
  earthOrbit.add(earthMesh)
  objects.push(earthMesh)

  // moon orbit
  // const moonOrbit = new THREE.Object3D()
  // moonOrbit.position.x = 2
  // earthOrbit.add(moonOrbit)
  
  // moon
  const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
  moonMesh.position.x = 2
  moonMesh.scale.set(0.5, 0.5, 0.5)
  // moonOrbit.add(moonMesh)
  earthOrbit.add(moonMesh)
  objects.push(moonMesh)

  // AxesHelper
  // objects.forEach((node) => {
  //   const axes = new THREE.AxesHelper()
  //   axes.material.depthTest = false
  //   axes.renderOrder = 1
  //   node.add(axes)
  // })

  class AxisGridHelper {
    constructor (node, units = 10) {
      const axes = new THREE.AxesHelper()
      axes.material.depthTest = false
      // after the grid
      axes.renderOrder = 2
      node.add(axes)

      const grid = new THREE.GridHelper(units, units)
      grid.material.depthTest = false
      grid.renderOrder = 1
      node.add(grid)

      this.grid = grid
      this.axes = axes
      this.visible = false
    }
    get visible () {
      return this._visible
    }
    set visible (v) {
      this._visible = v
      this.grid.visible = this.visible
      this.axes.visible = this.visible
    }
  }

  function makeAxisGrid (node, label, units) {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
  }

  makeAxisGrid(solarSystem, 'solarSystem', 25)
  makeAxisGrid(sunMesh, 'sunMesh')
  makeAxisGrid(earthOrbit, 'earthOrbit')
  makeAxisGrid(earthMesh, 'earthMesh')
  makeAxisGrid(moonMesh, 'moonMesh')

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

// function resizeRendererToDisplaySize (renderer) {
//   const canvas = renderer.domElement
//   const pixelRatio = window.devicePixelRatio
//   const width = canvas.clientWidth * pixelRatio | 0
//   const height = canvas.clientHeight * pixelRatio | 0
//   const needResize = canvas.width !== width || canvas.height !== height
//   if (needResize) {
//     renderer.setSize(width, height, false)
//   }
//   return needResize
// }