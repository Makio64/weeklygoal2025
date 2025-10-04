// from https://github.com/boytchev/tsl-textures/blob/main/src/tsl-utils.js
import { Fn, vec3 } from "three/tsl"

let v1 = vec3( 12.9898, 78.233, -97.5123 ).toConst()

// simple vector noise, vec3->float[-1,1]
const vnoise = Fn( ( [v] )=>{

	return v.dot( v1 ).sin().mul( 43758.5453 ).fract().mul( 2 ).sub( 1 )

} )

export default vnoise
export { vnoise }
