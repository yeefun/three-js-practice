// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../../../node_modules/three/build/three.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''
const canvas = document.getElementById('mycanvas')

let camera
let renderer
let scene
let planeSize
let planes

init()

function init () {
  camera = new THREE.OrthographicCamera(0, canvas.clientWidth, 0, canvas.clientHeight, -1, 1)
  // console.log(camera.position);
  // camera.position.set(1, 1, 0)
  
  // camera.zoom = 1

  renderer = new THREE.WebGLRenderer({ canvas })

  resizeRendererToDisplaySize()
  function resizeRendererToDisplaySize () {
    const pixelRatio = window.devicePixelRatio
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    renderer.setSize(width, height, false)
  }

  scene = new THREE.Scene()
  scene.background = new THREE.Color('black')

  // texture
  const loader = new THREE.TextureLoader()
  const textures = [
    loader.load(`${pathname}/assets/textures/flower-1.jpg`),
    loader.load(`${pathname}/assets/textures/flower-2.jpg`),
    loader.load(`${pathname}/assets/textures/flower-3.jpg`),
    loader.load(`${pathname}/assets/textures/flower-4.jpg`),
    loader.load(`${pathname}/assets/textures/flower-5.jpg`),
    loader.load(`${pathname}/assets/textures/flower-6.jpg`),
  ]

  planeSize = 256
  const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)

  planes = textures.map((texture) => {
    const planePivot = new THREE.Object3D()
    scene.add(planePivot)
    texture.magFilter = THREE.NearestFilter
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    planePivot.add(mesh)
    // move plane so top left corner is origin
    mesh.position.set(planeSize / 2, planeSize / 2, 0)
    return planePivot
  })

  // const axesHelper = new THREE.AxesHelper(16)
  // scene.add(axesHelper)

  // handle resize
  window.addEventListener('resize', handleWindowResize)
  function handleWindowResize () {
    resizeRendererToDisplaySize()
    camera.right = canvas.clientWidth
    camera.bottom = canvas.clientHeight
    camera.updateProjectionMatrix()
  }
}

function render (time) {
  time = time * 0.001

  const xRange = Math.max(20, canvas.clientWidth - planeSize) * 2
  const yRange = Math.max(20, canvas.clientHeight - planeSize) * 2

  planes.forEach((plane, ndx) => {
    const speed = 180
    const t = time * speed + ndx * 300
    const xt = t % xRange
    const yt = t % yRange

    const x = xt < (xRange / 2) ? xt : xRange - xt
    const y = yt < (yRange / 2) ? yt : yRange - yt

    plane.position.set(x, y, 0)
  })

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}
requestAnimationFrame(render)
