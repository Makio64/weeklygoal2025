<template>
	<button class="CompactWeekRow" @click="$emit('select', week)">
		<div class="dateRange">{{ formattedDateRange }}</div>
		<div class="percentage" :class="percentageClass">{{ stats.completionPercent }}%</div>
	</button>
</template>

<script>
export default {
	name: 'CompactWeekRow',
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
.CompactWeekRow
	width 100%
	display flex
	align-items center
	justify-content space-between
	padding 12px 16px
	background white
	border none
	border-radius 10px
	cursor pointer
	transition all 0.2s
	box-shadow 0 2px 8px rgba(0, 0, 0, 0.04)

	&:active
		transform scale(0.98)

	.dateRange
		font-family 'Jost', sans-serif
		font-size 14px
		font-weight 500
		color #010101

	.percentage
		font-family 'Jost', sans-serif
		font-size 16px
		font-weight 600

		&.excellent
			color #00D68F

		&.good
			color #6C5CE7

		&.needs-improvement
			color #FF6B6B
</style>
