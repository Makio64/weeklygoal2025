<template>
	<div class="HistoryTrendChart">
		<svg :viewBox="`0 0 ${width} ${height}`" class="chart">
			<!-- Gradient definition -->
			<defs>
				<linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#6C5CE7" stop-opacity="0.3" />
					<stop offset="100%" stop-color="#6C5CE7" stop-opacity="0" />
				</linearGradient>
			</defs>

			<!-- Grid lines (horizontal) -->
			<g class="gridLines">
				<line
					v-for="tick in yAxisTicks"
					:key="tick.value"
					:x1="padding.left"
					:y1="tick.y"
					:x2="width - padding.right"
					:y2="tick.y"
				/>
			</g>

			<!-- Y-axis labels -->
			<g class="yAxisLabels">
				<text
					v-for="tick in yAxisTicks"
					:key="'label-' + tick.value"
					:x="padding.left - 8"
					:y="tick.y"
					text-anchor="end"
					dominant-baseline="middle"
				>{{ tick.label }}</text>
			</g>

			<!-- Area under line -->
			<path
				v-if="data.length > 1"
				class="trendArea"
				:d="areaPath"
			/>

			<!-- Line path -->
			<path
				v-if="data.length > 1"
				ref="line"
				class="trendLine"
				:d="linePath"
				fill="none"
			/>

			<!-- Single point indicator if only 1 data point -->
			<circle
				v-if="data.length === 1"
				:cx="chartPoints[0]?.x"
				:cy="chartPoints[0]?.y"
				r="6"
				class="singlePoint"
			/>

			<!-- Data points (tappable) -->
			<g class="points">
				<circle
					v-for="point in chartPoints"
					:key="point.index"
					:cx="point.x"
					:cy="point.y"
					:r="pointRadius"
					:class="{ active: activePointIndex === point.index }"
					@click="handlePointTap(point)"
				/>
			</g>

			<!-- X-axis labels (week dates) - show subset if too many -->
			<g class="xAxisLabels">
				<text
					v-for="(point, i) in visibleXLabels"
					:key="'x-' + i"
					:x="point.x"
					:y="height - 6"
					text-anchor="middle"
				>{{ point.label }}</text>
			</g>
		</svg>
	</div>
</template>

<script>
import { animate } from 'animejs'

export default {
	name: 'HistoryTrendChart',
	props: {
		data: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['point-tap'],
	data() {
		return {
			width: 327,
			height: 160,
			padding: { top: 20, right: 16, bottom: 28, left: 32 },
			pointRadius: 6,
			activePointIndex: null,
		}
	},
	computed: {
		chartWidth() {
			return this.width - this.padding.left - this.padding.right
		},
		chartHeight() {
			return this.height - this.padding.top - this.padding.bottom
		},
		xScale() {
			const count = this.data.length
			if ( count <= 1 ) return () => this.chartWidth / 2
			return ( index ) => ( index / ( count - 1 ) ) * this.chartWidth
		},
		yScale() {
			return ( percent ) => this.chartHeight - ( percent / 100 ) * this.chartHeight
		},
		linePath() {
			if ( this.data.length < 2 ) return ''

			const points = this.data.map( ( d, i ) => {
				const x = this.padding.left + this.xScale( i )
				const y = this.padding.top + this.yScale( d.percent )
				return `${x},${y}`
			} )

			return `M ${points.join( ' L ' )}`
		},
		areaPath() {
			if ( this.data.length < 2 ) return ''

			const points = this.data.map( ( d, i ) => {
				const x = this.padding.left + this.xScale( i )
				const y = this.padding.top + this.yScale( d.percent )
				return `${x},${y}`
			} )

			const firstX = this.padding.left + this.xScale( 0 )
			const lastX = this.padding.left + this.xScale( this.data.length - 1 )
			const bottomY = this.padding.top + this.chartHeight

			return `M ${firstX},${bottomY} L ${points.join( ' L ' )} L ${lastX},${bottomY} Z`
		},
		chartPoints() {
			return this.data.map( ( d, i ) => ( {
				x: this.padding.left + this.xScale( i ),
				y: this.padding.top + this.yScale( d.percent ),
				percent: d.percent,
				week: d.week,
				label: d.label,
				index: i,
			} ) )
		},
		visibleXLabels() {
			const points = this.chartPoints
			if ( points.length <= 4 ) return points

			// Show first, last, and evenly distributed middle points
			const result = []
			const step = Math.ceil( points.length / 4 )
			for ( let i = 0; i < points.length; i += step ) {
				result.push( points[i] )
			}
			// Always include last point
			if ( result[result.length - 1] !== points[points.length - 1] ) {
				result.push( points[points.length - 1] )
			}
			return result
		},
		yAxisTicks() {
			return [0, 50, 100].map( v => ( {
				value: v,
				y: this.padding.top + this.yScale( v ),
				label: `${v}%`,
			} ) )
		},
	},
	mounted() {
		this.$nextTick( () => {
			this.animateChart()
		} )
	},
	methods: {
		animateChart() {
			const line = this.$refs.line
			if ( !line ) return

			const length = line.getTotalLength()
			line.style.strokeDasharray = length
			line.style.strokeDashoffset = length

			animate( line, {
				strokeDashoffset: 0,
				duration: 800,
				easing: 'easeOutQuad',
				delay: 200,
			} )

			// Animate points
			const points = this.$el.querySelectorAll( '.points circle' )
			points.forEach( ( point, i ) => {
				point.style.opacity = 0
				point.style.transform = 'scale(0)'
				animate( point, {
					opacity: 1,
					scale: 1,
					delay: 300 + i * 50,
					duration: 300,
					easing: 'easeOutBack',
				} )
			} )
		},
		handlePointTap( point ) {
			this.activePointIndex = point.index
			this.$emit( 'point-tap', point.week )

			setTimeout( () => {
				this.activePointIndex = null
			}, 300 )
		},
	},
}
</script>

<style lang="stylus" scoped>
.HistoryTrendChart
	background white
	border-radius 12px
	padding 16px
	box-shadow 0 2px 8px rgba(0, 0, 0, 0.04)
	margin-bottom 24px

	.chart
		width 100%
		height auto
		display block

		.gridLines line
			stroke #E8E9F3
			stroke-width 1

		.yAxisLabels text
			font-family 'Jost', sans-serif
			font-size 10px
			fill #A0A0A0

		.xAxisLabels text
			font-family 'Jost', sans-serif
			font-size 9px
			fill #A0A0A0

		.trendLine
			stroke #6C5CE7
			stroke-width 2.5
			stroke-linecap round
			stroke-linejoin round

		.trendArea
			fill url(#areaGradient)

		.singlePoint
			fill #6C5CE7

		.points circle
			fill #6C5CE7
			stroke white
			stroke-width 2
			cursor pointer
			transform-origin center
			transform-box fill-box

			&:active, &.active
				fill #A29BFE
</style>
