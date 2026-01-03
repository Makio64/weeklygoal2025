<template>
	<div class="HistoryStats">
		<div class="statCard">
			<div class="statValue" :class="averageClass">{{ averageCompletion }}%</div>
			<div class="statLabel">Average</div>
		</div>
		<div class="statCard">
			<div class="statValue">{{ totalWeeks }}</div>
			<div class="statLabel">Weeks tracked</div>
		</div>
		<div class="statCard">
			<div class="statValue">{{ totalTasksCompleted }}</div>
			<div class="statLabel">Tasks done</div>
		</div>
		<div class="statCard">
			<div class="statValue" :class="bestWeekClass">{{ bestWeekPercent }}%</div>
			<div class="statLabel">Best week</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'HistoryStats',
	props: {
		averageCompletion: {
			type: Number,
			default: 0,
		},
		totalWeeks: {
			type: Number,
			default: 0,
		},
		totalTasksCompleted: {
			type: Number,
			default: 0,
		},
		bestWeekPercent: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		averageClass() {
			if ( this.averageCompletion >= 80 ) return 'excellent'
			if ( this.averageCompletion >= 60 ) return 'good'
			return 'needs-improvement'
		},
		bestWeekClass() {
			if ( this.bestWeekPercent >= 80 ) return 'excellent'
			if ( this.bestWeekPercent >= 60 ) return 'good'
			return 'needs-improvement'
		},
	},
}
</script>

<style lang="stylus" scoped>
.HistoryStats
	display grid
	grid-template-columns 1fr 1fr
	gap 12px
	margin-bottom 24px

	.statCard
		background white
		border-radius 12px
		padding 16px
		text-align center
		box-shadow 0 2px 8px rgba(0, 0, 0, 0.04)

		.statValue
			font-size 28px
			font-weight 700
			color #010101
			margin-bottom 4px
			font-family 'Jost', sans-serif

			&.excellent
				color #00D68F

			&.good
				color #6C5CE7

			&.needs-improvement
				color #FF6B6B

		.statLabel
			font-size 12px
			color #A0A0A0
			font-weight 500
</style>
