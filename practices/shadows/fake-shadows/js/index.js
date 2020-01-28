// https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

import * as THREE from '../../../../node_modules/three/build/three.module.js'
// import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js'
// import { GUI } from '../../../../node_modules/three/examples/jsm/libs/dat.gui.module.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

const canvas = document.getElementById('mycanvas')
const sphereShadowBases = []

let camera
let renderer
let scene

init()

function init () {
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 10, 20)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ canvas })
  renderer.physicallyCorrectLights = true
  resizeRendererToDisplaySize()
  function resizeRendererToDisplaySize () {
    const pixelRatio = window.devicePixelRatio
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    renderer.setSize(width, height, false)
  }

  scene = new THREE.Scene()
  scene.background = new THREE.Color('white')

  // texture
  const loader = new THREE.TextureLoader()
  {
    const planeSize = 40
    const texture = loader.load(`${pathname}/assets/textures/checker.png`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    // object
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    planeMat.color.setRGB(1.5, 1.5, 1.5)
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh)
  }

  const shadowTexture = loader.load(`${pathname}/assets/textures/round-shadow.png`)
  {
    const sphereRadius = 1
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)

    const planeSize = 1
    const shadowGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)

    const numSpheres = 15
    for (let i = 0; i < numSpheres; i += 1) {
      // make a base for the shadow and the sphere
      // so they move together.
      const base = new THREE.Object3D()
      scene.add(base)

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        // so we can see the ground
        transparent: true,
        // so we don't have to sort
        depthWrite: false
      })
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
      // so we're above the ground slightly
      shadowMesh.position.y = 0.001
      shadowMesh.rotation.x = Math.PI * -0.5
      const shadowSize = sphereRadius * 4
      shadowMesh.scale.set(shadowSize, shadowSize, shadowSize)
      base.add(shadowMesh)

      // add the sphere to the base
      // goes from 0 to 1 as we iterate the spheres.
      const u = i / numSpheres
      const sphereMat = new THREE.MeshPhongMaterial()
      sphereMat.color.setHSL(u, 1, 0.75)
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
      sphereMesh.position.set(0, sphereRadius + 2, 0)
      base.add(sphereMesh)

      // remember all 3 plus the y position
      sphereShadowBases.push({
        base,
        sphereMesh,
        shadowMesh,
        y: sphereMesh.position.y
      })
    }
  }

  // light
  {
    // light blue
    const skyColor = 0xb1e1ff
    // brownish orange
    const groundColor = 0xb97a20
    const intensity = 2
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    scene.add(light)
  }

  {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 5)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }

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
  // convert to seconds
  time = time * 0.001

  sphereShadowBases.forEach((sphereShadowBase, ndx) => {
    const { base, sphereMesh, shadowMesh, y } = sphereShadowBase

    // u is a value that goes from 0 to 1 as we iterate the spheres
    const u = ndx / sphereShadowBases.length

    // compute a position for the base. This will move
    // both the sphere and its shadow
    const speed = time * 0.2
    const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1)
    const radius = Math.sin(speed - ndx) * 10
    base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)

    // yOff is a value that goes from 0 to 1
    const yOff = Math.abs(Math.sin(time * 2 + ndx))
    // move the sphere up and down
    sphereMesh.position.y = y + THREE.Math.lerp(-2, 2, yOff)
    // fade the shadow as the sphere goes up
    shadowMesh.material.opacity = THREE.Math.lerp(1, 0.25, yOff)
  })
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
