import { smoothstep } from "three/tsl"

import oklab_mix from "./oklabmix"

let inc = 0

/**
 * Smooth color gradient between multiple colors.
 * @param {Array} colors array of colors
 * @param {float} percent current percentage (0 to 1)
 * @param {Array||null} percents array of percents for each color (default is linear interpolation if not provided)
 * @returns {vec3} interpolated color
 */
export const gradient = ( colors, percent, percents )=>{
	// linear percentage interpolation if percents not provided
	percents ??= colors.map( ( _, i )=>i / ( colors.length - 1 ) )

	let col = colors[0].toVar( 'col' )
	for( let i = 1; i < colors.length; i++ ) {
		col = oklab_mix( col, colors[i], smoothstep( percents[i - 1], percents[i], percent ) ).toVar()
	}
	return col.label( `gradient${inc++}` )
}
