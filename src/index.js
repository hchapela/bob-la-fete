import './css/style.styl'
import * as THREE from 'three'
// Other js files
import Particle from './js/Particle'
// Camera import
import CameraControls from 'camera-controls'
CameraControls.install( { THREE: THREE } )
// Import Loaders for OBJ and MTL + Files
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import planetMaterials from './images/materials.mtl'
import planetObj from './images/model.obj'

class Main {
    constructor() {
        // Create scene
        this.scene = new THREE.Scene()
        // Texture loader
        this.textureLoader = new THREE.TextureLoader()
        // Init scope of functions
        this.initScope()
        // init all the scene
        this.initOBJ()
        this.initCanvas()
        this.initCamera()
        this.initRenderer()
        this.initLights()
        this.initCursor()
        this.initControls()
        this.initLoop()
        // Import elements of the scene
        this.particle = new Particle(this)
    }

    initScope() {
        this.initLoop = this.initLoop.bind(this)
    }

    initOBJ() {
        // setup loaders
        let mtlLoader = new MTLLoader()
        let objLoader = new OBJLoader()
        // Import files
        mtlLoader.load(planetMaterials, (materials) => {
            materials.preload()
            objLoader.setMaterials(materials)
            objLoader.load(planetObj, (object) => {
                this.scene.add(object)
            })
        })
    }

    initCanvas() {
        this.sizes = {}
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
            
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight
        
            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        
            // Update
            this.renderer.setSize(sizes.width, sizes.height)
        })
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height)
        this.camera.position.z = 10
        this.scene.add(this.camera)
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.shadowMap.enabled = true
        document.body.appendChild(this.renderer.domElement)
        this.renderer.gammaInput = true
        this.renderer.gammaOutput = true
    }

    initLights() {
        this.lights = []
        // First light
        this.lights[0] = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(this.lights[0])

        this.lights[1] = new THREE.DirectionalLight(0xFFFFFF, 0.6)
        this.lights[1].position.y = 1
        this.lights[1].position.x = 1
        this.lights[1].position.z = 1
        this.scene.add(this.lights[1])
    }

    initCursor() {
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0
        // Event of update
        window.addEventListener('mousemove', (_event) =>
        {
            this.cursor.x = _event.clientX / this.sizes.width - 0.5
            this.cursor.y = _event.clientY / this.sizes.height - 0.5
        })

    }

    initControls() {
        this.clock = new THREE.Clock()
        this.cameraControls = new CameraControls( this.camera, this.renderer.domElement )
    }

    initLoop() {
        // Call the loop on each frame
        window.requestAnimationFrame(this.initLoop)
        // Update controls
        this.delta = this.clock.getDelta()
        this.hasControlsUpdated = this.cameraControls.update( this.delta )
        // controls.update()

        // Update camera
        this.camera.position.x = this.cursor.x * 3
        this.camera.position.y = - this.cursor.y * 3
        this.camera.lookAt(new THREE.Vector3())


        // Renderer
        if ( this.hasControlsUpdated ) {
            this.renderer.render( this.scene, this.camera )
        }
    }
}

const main = new Main()


/**
 * Particles
 */
// const particle = new Particle({ textureLoader })
// scene.add(particle.container)
