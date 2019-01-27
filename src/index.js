import './css/style.styl'
import * as THREE from 'three'
// Other js files
import Boba from './js/Boba'
// Camera import
import CameraControls from 'camera-controls'
CameraControls.install( { THREE: THREE } )
// import favicon
import favicon from '../static/favicon.ico'


class Main {
    constructor() {
        // Create scene
        this.scene = new THREE.Scene()
        // Texture loader
        this.textureLoader = new THREE.TextureLoader()

        this.cameraMovementRatio = 50
        // Init scope of functions
        this.initScope()
        // init all the scene
        this.initCanvas()
        this.initCamera()
        this.initRenderer()
        this.initLights()
        this.initCursor()
        this.initControls()

        // Import elements of the scene
        this.boba = new Boba(this)

        this.initLoop()
    }

    initScope() {
        this.initLoop = this.initLoop.bind(this)
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
            this.renderer.setSize(this.sizes.width, this.sizes.height)
        })
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height)
        this.originZ = 7
        this.camera.position.z = this.originZ
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
        // Second light
        this.spotLight = new THREE.SpotLight( 0xFFFFFF, 0.2 );
        this.spotLight.name = 'Spot Light';
        this.spotLight.angle = Math.PI;
        this.spotLight.penumbra = 0.7;
        this.spotLight.position.set( 5, 5, 5 );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 8;
        this.spotLight.shadow.camera.far = 30;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.scene.add( this.spotLight );

        window.addEventListener('mousemove', (_event) => {
            let posX = (_event.clientX * 100) / this.sizes.width
            let posY = (_event.clientY * 100) / this.sizes.height

            this.spotLight.position.set(
                posX,
                posY,
                3
            )
        })
    }

    initCursor() {
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0

        this.mouse = new THREE.Vector2()
        
        // Event of update
        window.addEventListener('mousemove', (_event) =>
        {
            this.cursor.x = _event.clientX / this.sizes.width - 0.5
            this.cursor.y = _event.clientY / this.sizes.height - 0.5

            this.mouse.x = ( event.clientX / this.sizes.width ) * 2 - 1;
            this.mouse.y = - ( event.clientY / this.sizes.height ) * 2 + 1;
        })

    }

    initControls() {
        this.clock = new THREE.Clock()
        this.cameraControls = new CameraControls( this.camera, this.renderer.domElement, {ignoreDOMEventListeners: true} )
        this.zoomSensitivity = 30
        this.isDragged = false

        // Scroll movement
        window.addEventListener('wheel', (_event) => {
            // where to move
            let moveY = (_event.deltaY % 20) / this.zoomSensitivity
            // Boolean to know if we are in the mooving zone area
            let canMove = true
            // Not move to close
            if(this.currentPos.z + moveY < 5 && _event.deltaY > 0) {
                canMove = false
            }
            // Not move to far
            else if(this.currentPos.z + moveY > 10 && _event.deltaY < 0) {
                canMove = false
            }
            // If we want to scroll not to far then move
            if(canMove) {
                this.cameraControls.forward(moveY, true)
            }
            
        })

    }

    initLoop() {
        // Call the loop on each frame
        window.requestAnimationFrame(this.initLoop)
        // Update controls
        this.delta = this.clock.getDelta()
        this.hasControlsUpdated = this.cameraControls.update( this.delta )

        // Update camera
        this.camera.position.x = this.cursor.x * 3
        this.camera.position.y = - this.cursor.y * 3
        this.camera.lookAt(new THREE.Vector3())

        // Update positions of camera
        this.currentPos = this.cameraControls.getPosition()

        // Get time
        this.timer = 0.0001 * Date.now()
        this.scene.position.x = Math.sin(this.timer) / 2
        this.scene.position.y = Math.cos(this.timer) / 2
        this.scene.rotateY(Math.abs(Math.cos(this.timer) / this.cameraMovementRatio))

        this.renderer.render( this.scene, this.camera )
    }
}

const main = new Main()