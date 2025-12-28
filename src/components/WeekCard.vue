<template>
	<button class="WeekCard" @click="$emit('select', week)">
		<div class="left">
			<div class="dateRange">{{ formattedDateRange }}</div>
			<div class="progressBar">
				<div class="progressFill" :style="{ width: stats.completionPercent + '%' }" :class="percentageClass" />
			</div>
		</div>
		<div class="right">
			<div class="percentage" :class="percentageClass">{{ stats.completionPercent }}%</div>
			<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>
	</button>
</template>

<script>
export default {
	name: 'WeekCard',
	props: {
		week: {
			type: Object,
			required: true,
		},
	},
	emits: ['select'],
	computed: {
		stats() {
			return this.week?.stats || {
				completionPercent: 0,
				completedTasks: 0,
				totalTasks: 0,
				goalCount: 0,
			}
		},
		percentageClass() {
			const percent = this.stats.completionPercent
			if ( percent >= 80 ) return 'excellent'
			if ( percent >= 60 ) return 'good'
			return 'needs-improvement'
		},
		formattedDateRange() {
			if ( !this.week?.weekStart || !this.week?.weekEnd ) return ''

			const start = new Date( this.week.weekStart )
			const end = new Date( this.week.weekEnd )

			const options = { month: 'short', day: 'numeric' }
			const startStr = start.toLocaleDateString( 'en-US', options )
			const endStr = end.toLocaleDateString( 'en-US', options )

			return `${startStr} - ${endStr}`
		},
	},
}
</script>

<style lang="stylus" scoped>
.WeekCard
	width 100%
	padding 16px
	background white
	border none
	border-radius 12px
	cursor pointer
	display flex
	align-items center
	justify-content space-between
	transition all 0.2s
	box-shadow 0 2px 8px rgba(0, 0, 0, 0.04)

	&:active
		transform scale(0.98)

	.left
		flex 1
		display flex
		flex-direction column
		gap 8px
		text-align left

		.dateRange
			font-family 'Jost', sans-serif
			font-size 16px
			font-weight 500
			color #010101

		.progressBar
			height 6px
			width 100%
			max-width 180px
			background #E8E9F3
			border-radius 100px
			overflow hidden

			.progressFill
				height 100%
				transition width 0.3s

				&.excellent
					background #00D68F

				&.good
					background linear-gradient(90deg, #6C5CE7 0%, #A29BFE 100%)

				&.needs-improvement
					background #FF6B6B

	.right
		display flex
		align-items center
		gap 8px

		.percentage
			font-family 'Jost', sans-serif
			font-size 20px
			font-weight 600

			&.excellent
				color #00D68F

			&.good
				color #6C5CE7

			&.needs-improvement
				color #FF6B6B

		.chevron
			color #A0A0A0
</style>
