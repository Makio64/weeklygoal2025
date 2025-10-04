import { float, Fn, uint, uvec3, vec3 } from "three/tsl"

// TSL Port of hash33 https://www.shadertoy.com/view/XlXcW4 by Inigo Quilez
const k = uint( 1103515245 ).toConst()
const ffffffff = float( 1 ).div( 0xffffffff ).toConst()
const shift = uvec3( 8 ).toConst()

const hash33 = Fn( ( [x_immutable] ) => {

	const x = x_immutable.toVar()

	x.assign( x.shiftRight( shift ).bitXor( x.yzx ).mul( k ) )
	x.assign( x.shiftRight( shift ).bitXor( x.yzx ).mul( k ) )
	x.assign( x.shiftRight( shift ).bitXor( x.yzx ).mul( k ) )

	return vec3( x ).mul( ffffffff )

} ).setLayout( {
	name: 'hash33', type: 'vec3',
	inputs: [{ name: 'x', type: 'uvec3' }]
} )

export default hash33
export { hash33 }



