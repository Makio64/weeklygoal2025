import { animate } from 'animejs'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { color, Fn, uv } from 'three/tsl'
import { AmbientLight, BoxGeometry, DirectionalLight, EquirectangularReflectionMapping, Mesh, MeshBasicNodeMaterial, PMREMGenerator } from 'three/webgpu'

import { stage } from '@/makio/core/stage'
import Assets from '@/makio/three/Assets'
// import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader'
import OrbitControl from '@/makio/three/controls/OrbitControl'
import stage3d from '@/makio/three/stage3d'
import { gradient } from '@/makio/tsl/gradient'

class Manager3D {
	constructor() {
		this.isInit = false
	}

	async init() {
		if( !this.isInit ) {
			this.isInit = true
			await stage3d.initRender()
			stage3d.control = new OrbitControl( stage3d.camera, 5 )
			this.addLight()
			// Load HDR and assets in parallel
			await Promise.all( [
				this.initHDR(),
				this.loadAssets()
			] )
		}

		this.initScene()
	}

	initScene() {
		this.box = new Mesh( new BoxGeometry( 1, 1, 1 ), new MeshBasicNodeMaterial( { wireframe: false, transparent: true, opacity: 0, color: 0xff0000 } ) )

		let col = Fn( ()=>{
			// return oklab_mix( color( 0xff0000 ), color( 0x00ff00 ), uv().y )
			let c1 = color( 0xff0000 ).toVar( 'c1' )
			let c2 = color( 0x00ff00 ).toVar( 'c2' )
			let c3 = color( 0x0000ff ).toVar( 'c3' )
			// return gradient( [c1, c2, c3, c3], uv().y, [0.5, 0.501, 0.6, 1] )
			return gradient( [c1, c2, c3, c3],  uv().y, null )
		} )

		this.box.material.colorNode = col()

		stage3d.add( this.box )
		stage.onUpdate.add( this.update )
	}

	addLight() {
		this.ambient = new AmbientLight( 0xffffff, 1 ) // Soft white light
		this.sun = new DirectionalLight( 0xffffff, 2 )
		this.sun.position.set( 5, 3, 5 ) // Position the sun
		stage3d.add( this.ambient )
		stage3d.add( this.sun )
	}

	async loadHDR() {
		let loader = this.loaderHDR = this.loaderHDR || new UltraHDRLoader()
		// loader.setDataType( THREE[ type ] );
		let texture = await loader.loadAsync( '/hdr/royal_esplanade_256x128.jpg' )
		texture.mapping = EquirectangularReflectionMapping
		texture.needsUpdate = true
		// stage3d.scene.background = texture
		stage3d.scene.environment = texture
		stage3d.render()
	}


	async initHDR() {
		const env = new RoomEnvironment()
		const pmrem = new PMREMGenerator( stage3d.	renderer )
		pmrem.compileCubemapShader()
		const envMap = await pmrem.fromScene( env ).texture
		stage3d.scene.environment = envMap
		env.dispose()
		pmrem.dispose()
	}

	async loadAssets() {
		return new Promise( ( resolve ) => {
			resolve()
			Assets.onLoadComplete.addOnce( resolve )
		} )
	}


	update = () => {
		this.box.rotateX( 0.01 )
	}

	show() {
		animate( this.box.material, { duration: 0.4, opacity: 1 } )
		animate( this.box.position, { duration: 1.1, y: [-2, 0], ease: 'outBack' } )
	}

	hide( cb ) {
		animate( this.box.material, { duration: 1, opacity: 0 } )
		animate( this.box.position, { duration: 1, y: 3, ease: 'inQuad', onComplete: () => {	this.dispose(); cb()} } )
	}

	dispose() {
		// Remove objects from scene
		if ( this.box ) {
			stage3d.remove( this.box )
			this.box.geometry?.dispose()
			this.box.material?.dispose()
			this.box = null
		}

		// Remove lights
		if ( this.ambient ) {
			stage3d.remove( this.ambient )
			this.ambient.dispose()
			this.ambient = null
		}
		if ( this.sun ) {
			stage3d.remove( this.sun )
			this.sun.dispose()
			this.sun = null
		}

		// Remove update listener
		stage.onUpdate.remove( this.update )
	}
}

export default new Manager3D()
