// https://threejs.org/examples/?q=glt#webgl_loader_gltf

import * as THREE from '../../node_modules/three/build/three.module.js'
import { RGBELoader } from '../../node_modules/three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
// import { RoughnessMipmapper } from '../../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js'

const pathname = location.pathname.includes('three-js-practice') ? '/three-js-practice' : ''

let container
let scene
let camera
let renderer

init()
animate()

function init () {

  container = document.createElement('div')
  document.body.appendChild(container)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20)
  camera.position.set(-1.8, 0.6, 2.7)

  new RGBELoader()
    // .setDataType(THREE.UnsignedByteType)
    .setPath(`${pathname}/assets/textures/equirectangular/`)
    .load('royal_esplanade_1k.hdr', function (texture) {
      var envMap = pmremGenerator.fromEquirectangular(texture).texture
      pmremGenerator.dispose()
      scene.background = envMap
      scene.environment = envMap

      // model
      // const roughnessMipmapper = new RoughnessMipmapper(renderer)
      const loader = new GLTFLoader().setPath(`${pathname}/assets/models/gltf/DamagedHelmet/glTF/`)
      loader.load('DamagedHelmet.gltf', function (gltf) {
        // gltf.scene.traverse(function (child) {
        //   if (child.isMesh) {
        //     roughnessMipmapper.generateMipmaps(child.material)
        //   }
        // })
        // scene.add(gltf.scene);
        // roughnessMipmapper.dispose()
      })
    })

  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // renderer.toneMapping = THREE.ACESFilmicToneMapping
  // renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild(renderer.domElement)

  var pmremGenerator = new THREE.PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  window.addEventListener('resize', handleWindowResize)
}

function animate () {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
