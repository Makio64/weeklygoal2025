import { Fn, mix, rand, uv, vec3 } from "three/tsl"

// Dithering TSL version by @makio64 | David Ronai
// Based on THREE.js dithering shader chunk :
// Port from : https://github.com/mrdoob/three.js/blob/c8ff82d7196d6d7d1e64efd18c6ead16097a2b7b/src/renderers/shaders/ShaderChunk/dithering_pars_fragment.glsl.js#L2

const v = 0.5 / 255
const v1 = vec3( v, -v, v ).toConst()
const v2 = vec3( -v, v, -v ).toConst()

export const dithering = Fn( ( [color] ) => {
	return color.add( mix( v1, v2, rand( uv() ) ) )
} )
