<template>
	<Modal :show="show" @close="handleClose">
		<div class="WeeklyRecap">
			<div class="header">
				<h2 class="title">{{ isHistory ? 'Week Recap' : 'Last Week Recap' }}</h2>
				<p class="subtitle">{{ formattedWeekRange }}</p>
			</div>

			<div class="stats">
				<div class="mainStat">
					<div class="percentage" :class="percentageClass">{{ stats.completionPercent }}%</div>
					<div class="label">Completed</div>
				</div>

				<div class="detailStats">
					<div class="statItem">
						<div class="statValue">{{ stats.completedTasks }}/{{ stats.totalTasks }}</div>
						<div class="statLabel">Tasks Done</div>
					</div>
					<div class="statItem">
						<div class="statValue">{{ stats.goalCount }}</div>
						<div class="statLabel">Goals</div>
					</div>
				</div>
			</div>

			<div v-if="shouldShowSuggestion" class="suggestion">
				<div class="suggestionText">
					<strong>Tip:</strong> Consider reducing your goals and focusing more on completion.
					Quality over quantity! Start with fewer goals and add more as you build consistency.
				</div>
			</div>

			<div class="goals">
				<h3 class="goalsTitle">Your Goals</h3>
				<div class="goalsList">
					<div v-for="goal in recap.goals" :key="goal.id" class="goalItem">
						<div class="goalInfo">
							<span class="goalIcon">{{ goal.icon }}</span>
							<span class="goalName">{{ goal.name }}</span>
						</div>
						<div class="goalProgress">
							<span class="goalCount">{{ goal.progress }}/{{ goal.repetitions }}</span>
							<span v-if="goal.progress >= goal.repetitions" class="checkmark">✓</span>
						</div>
					</div>
				</div>
			</div>

			<button class="closeButton" @click="handleClose">
				{{ isHistory ? 'Close' : 'Start New Week 🚀' }}
			</button>
		</div>
	</Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
	name: 'WeeklyRecap',
	components: {
		Modal,
	},
	props: {
		show: { type: Boolean, default: false },
		recap: {
			type: Object,
			default: () => ( {
				weekStart: new Date().toISOString(),
				weekEnd: new Date().toISOString(),
				goals: [],
				stats: {
					totalTasks: 0,
					completedTasks: 0,
					completionPercent: 0,
					goalCount: 0,
				},
			} ),
		},
		isHistory: { type: Boolean, default: false },
	},
	emits: ['close'],
	computed: {
		stats() {
			return this.recap?.stats || {}
		},
		shouldShowSuggestion() {
			return this.stats.completionPercent < 80 && this.stats.goalCount > 0
		},
		percentageClass() {
			const percent = this.stats.completionPercent
			if ( percent >= 80 ) return 'excellent'
			if ( percent >= 60 ) return 'good'
			return 'needs-improvement'
		},
		formattedWeekRange() {
			if ( !this.recap?.weekStart || !this.recap?.weekEnd ) return ''

			const start = new Date( this.recap.weekStart )
			const end = new Date( this.recap.weekEnd )

			const options = { month: 'short', day: 'numeric' }
			const startStr = start.toLocaleDateString( 'en-US', options )
			const endStr = end.toLocaleDateString( 'en-US', options )

			return `${startStr} - ${endStr}`
		},
	},
	methods: {
		handleClose() {
			this.$emit( 'close' )
		},
	},
}
</script>

<style lang="stylus" scoped>
.WeeklyRecap
	background white
	padding 32px 24px
	display flex
	flex-direction column
	gap 24px
	font-family 'Jost', sans-serif

	.header
		text-align center

		.title
			font-size 28px
			font-weight 600
			color #010101
			margin 0 0 8px 0

		.subtitle
			font-size 14px
			color #A0A0A0
			margin 0

	.stats
		display flex
		flex-direction column
		gap 16px
		padding 20px
		background #F6F7FF
		border-radius 12px

		.mainStat
			text-align center

			.percentage
				font-size 56px
				font-weight 700
				line-height 1
				margin-bottom 8px

				&.excellent
					color #00D68F

				&.good
					color #6C5CE7

				&.needs-improvement
					color #FF6B6B

			.label
				font-size 14px
				color #A0A0A0
				font-weight 500

		.detailStats
			display grid
			grid-template-columns 1fr 1fr
			gap 16px

			.statItem
				text-align center
				padding 12px
				background white
				border-radius 8px

				.statValue
					font-size 24px
					font-weight 600
					color #010101
					margin-bottom 4px

				.statLabel
					font-size 12px
					color #A0A0A0

	.suggestion
		display flex
		padding 16px
		background #FFF9E6
		border-left 4px solid #FFB800
		border-radius 8px

		.suggestionText
			font-size 14px
			line-height 1.5
			color #010101

			strong
				font-weight 600

	.goals
		.goalsTitle
			font-size 18px
			font-weight 600
			color #010101
			margin 0 0 12px 0

		.goalsList
			display flex
			flex-direction column
			gap 8px

			.goalItem
				display flex
				justify-content space-between
				align-items center
				padding 12px
				background #F6F7FF
				border-radius 8px

				.goalInfo
					display flex
					align-items center
					gap 8px

					.goalIcon
						font-size 20px

					.goalName
						font-size 15px
						color #010101

				.goalProgress
					display flex
					align-items center
					gap 8px

					.goalCount
						font-size 14px
						font-weight 500
						color #6C5CE7

					.checkmark
						color #00D68F
						font-size 18px

	.closeButton
		width 100%
		padding 16px
		background linear-gradient(90deg, #6C5CE7 0%, #A29BFE 100%)
		border none
		border-radius 12px
		color white
		font-size 16px
		font-weight 600
		font-family 'Jost', sans-serif
		cursor pointer
		transition transform 0.2s

		&:active
			transform scale(0.98)
</style>
