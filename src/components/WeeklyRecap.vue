<template>
	<Modal :show="show" @close="handleClose">
		<div class="WeeklyRecap">
			<div class="header">
				<h2 class="title">{{ isHistory ? 'Week Recap' : 'Last Week Recap' }}</h2>
				<p class="subtitle">{{ formattedWeekRange }}</p>
			</div>

			<div class="stats">
				<div class="mainStat">
					<div class="circleContainer">
						<SVGCircle
							ref="progressCircle"
							:radius="60"
							:stroke-width="8"
							:color="progressColor"
						/>
						<div class="percentageValue" :style="{ color: progressColor }">
							{{ stats.completionPercent }}%
						</div>
					</div>
					<div class="label">Done!</div>
				</div>

				<!-- <div class="detailStats">
					<div class="statItem">
						<div class="statValue">{{ stats.completedTasks }}/{{ stats.totalTasks }}</div>
						<div class="statLabel">Tasks Done</div>
					</div>
					<div class="statItem">
						<div class="statValue">{{ stats.goalCount }}</div>
						<div class="statLabel">Goals</div>
					</div>
				</div> -->
			</div>


			<div class="goals">
				<h3 class="goalsTitle">Your Goals</h3>
				<div class="goalsList">
					<Goal
						v-for="goal in recap.goals"
						:id="goal.id"
						:key="goal.id"
						:name="goal.name"
						:icon="goal.icon"
						:category="goal.category"
						:repetitions="goal.repetitions"
						:progress="goal.progress"
						:read-only="true"
					/>
				</div>
			</div>

			<div class="footer">
				<button class="actionButton" @click="handleClose">
					{{ isHistory ? 'Close' : 'Start New Week 🚀' }}
				</button>
			</div>
			<div v-if="shouldShowSuggestion" class="suggestion">
				<div class="suggestionText">
					<strong>Tip:</strong> Consider reducing your goals and focusing more on completion.
					Quality over quantity! Start with fewer goals and add more as you build consistency.
				</div>
			</div>
		</div>
	</Modal>
</template>

<script>
import Goal from './Goal.vue'
import Modal from './Modal.vue'
import SVGCircle from './ui/SVGCircle.vue'

export default {
	name: 'WeeklyRecap',
	components: {
		Modal,
		Goal,
		SVGCircle,
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
		progressColor() {
			const percent = this.stats.completionPercent
			if ( percent >= 80 ) return '#00D68F' // Excellent
			if ( percent >= 60 ) return '#6C5CE7' // Good
			return '#FF6B6B' // Needs Improvement
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
	watch: {
		// Update the circle when the modal opens or stats change
		show( newVal ) {
			if ( newVal ) {
				this.$nextTick( () => {
					this.updateCircle()
				} )
			}
		},
		'recap.stats.completionPercent'() {
			if ( this.show ) {
				this.updateCircle()
			}
		}
	},
	methods: {
		handleClose() {
			this.$emit( 'close' )
		},
		updateCircle() {
			if ( this.$refs.progressCircle ) {
				this.$refs.progressCircle.setPercent( this.stats.completionPercent, false )
			}
		}
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
		//background #F6F7FF
		border-radius 12px

		.mainStat
			display flex
			flex-direction column
			align-items center
			gap 12px

			.circleContainer
				position relative
				width 120px
				height 120px
				display flex
				align-items center
				justify-content center

				.percentageValue
					position absolute
					font-size 32px
					font-weight 700
					font-family 'Jost', sans-serif

			.label
				font-size 14px
				color #A0A0A0
				font-weight 500

		.detailStats
			display grid
			grid-template-columns 1fr 1fr
			gap 16px
			margin-top 8px

			.statItem
				text-align center
				padding 12px
				background white
				border-radius 8px
				box-shadow 0 2px 4px rgba(0,0,0,0.02)

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
			gap 12px

	.footer
		margin-top 8px

	.actionButton
		width 100%
		padding 16px
		background #3445E1
		border none
		border-radius 6px
		font-family 'Jost', sans-serif
		font-size 18px
		font-weight 500
		color #FFF
		cursor pointer
		box-shadow 0 4px 30px rgba(0, 0, 0, 0.24)
		transition transform 0.2s

		&:active
			transform scale(0.98)
</style>
