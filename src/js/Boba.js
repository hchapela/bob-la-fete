import * as THREE from 'three'
// Import Loaders for OBJ and MTL + Files
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import planetMaterials from '../images/materials.mtl'
import planetObj from '../images/model.obj'
import song from '../assets/bob-la-fete.mp3'

export default class Particle {
    constructor(_main) {
        this.main = _main
        // no error on objects getting
        this.objects = null
        
        this.song = new Audio(song)
        // Init lights
        this.initFlash()
        // import models
        this.initImport()
    }

    initScope() {
        this.initImport = this.initImport.bind(this)
    }

    initImport() {
        // setup loaders
        this.mtlLoader = new MTLLoader()
        this.objLoader = new OBJLoader()
        // Import files
        this.mtlLoader.load(planetMaterials, (materials) => {
            materials.preload()
            this.objLoader.setMaterials(materials)
            this.objLoader.load(planetObj, (object) => {
                this.objects = object
                
                this.main.scene.add(object)
                this.initAnimation()
            })
        })
    }

    initRotation() {
        this.rotation = window.setInterval(() => {
            this.objects.rotateY(Math.PI / 100)
        }, 10);
    }

    clearRotation() {
        window.clearInterval(this.rotation)
    }

    initFlash() {
        this.flashLight = new THREE.AmbientLight( 0xFFFFFF, 0 )
        this.main.scene.add( this.flashLight )

        this.hover = document.createElement('div')
        this.hover.classList.add('hover-flash')
        document.body.insertBefore(this.hover, document.querySelector('canvas'))
        this.messageClick = document.querySelector('.click')
    }

    initAnimation() {
        window.addEventListener('mousedown', () => {
            // Hide message click
            this.messageClick.style.opacity = '0'
            // start rotate
            this.initRotation()
            // start song
            this.song.loop = true
            this.song.play()
            // make flashes
            this.flashLight.intensity = 1
            // create new color each time
            this.hover.style.opacity = 0.2
            this.flashInterval = window.setInterval(() => {
                let newColor = new THREE.Color(`hsl(${Math.floor(Math.random() * 255)}, 60%, 50%)`)
                this.flashLight.color = newColor
                this.hover.style.background = `#${this.flashLight.color.getHex().toString(16)}`
            }, 400)
            this.zoomAnimation()

        })
        window.addEventListener('mouseup', () => {
            this.messageClick.style.opacity = '0.6'
            this.clearRotation()
            this.song.pause()
            this.flashLight.intensity = 0
            window.clearInterval(this.flashInterval)
            this.hover.style.background = '#2319c3'
            this.hover.style.opacity = 0.1
            window.clearInterval(this.zoomInterval)
            // Reset camera position
            let resetCameraZ = (this.main.cameraControls.getPosition()).z - this.main.originZ
            this.main.cameraControls.forward(resetCameraZ, true)
            
        })
    }

    zoomAnimation() {
        this.intensityZoom = -10
        this.zoomValue = 1
        this.zoomInterval = window.setInterval(() => {
            this.main.cameraControls.forward(this.intensityZoom * this.zoomValue, true)
            this.zoomValue *= -1
        }, 200)
    }
}