<template>
	<div class="HomeView view">
		<div class="header">
			<div class="title">My weekly goal lists</div>
			<div class="subtitle">Track your week with us, see it<br>you can do it!</div>
		</div>

		<div class="progressSection">
			<div class="progressBar">
				<div class="progressFill" :style="{ width: completionPercent + '%' }" />
			</div>
			<div class="progressText">{{ completionPercent }}% done!</div>
		</div>

		<div class="stats">
			<GoalDone :count="goalsDone" />
			<DailyStrike :days="strikesDays" />
		</div>

		<div class="sendCard">
			<span class="icon">🎄 💌</span>
			<span>Send xmas card</span>
		</div>

		<div class="goalList">
			<template v-if="goals.length === 0">
				<div class="emptyState">
					<img src="/img/nothing-here.png" alt="No goals yet" class="emptyIllustration">
				</div>
			</template>
			<template v-else>
				<div class="goals">
					<Goal
						v-for="goal in goals"
						:key="goal.id"
						:name="goal.name"
						:icon="goal.icon"
						:repetitions="goal.repetitions"
						:progress="goal.progress"
						@update="updateGoal(goal.id, $event)"
						@edit="editGoal(goal.id)"
						@remove="removeGoal(goal.id)"
					/>
				</div>
			</template>
			<AddNewGoal @click="addNewGoal" />
		</div>

		<div class="ctaSection">
			<DevelopmentTip />
		</div>

		<FeedbackCTA @click="openFeedback" />
	</div>
</template>

<script>
import AddNewGoal from '@/components/AddNewGoal.vue'
import DailyStrike from '@/components/DailyStrike.vue'
import DevelopmentTip from '@/components/DevelopmentTip.vue'
import FeedbackCTA from '@/components/FeedbackCTA.vue'
import Goal from '@/components/Goal.vue'
import GoalDone from '@/components/GoalDone.vue'
import { goals, initializeGoals } from '@/store'

export default {
	name: 'HomeView',
	components: { Goal, GoalDone, DailyStrike, FeedbackCTA, DevelopmentTip, AddNewGoal },
	data() {
		return {
			goals,
			strikesDays: 3,
		}
	},
	computed: {
		goalsDone() {
			return this.goals.filter( g => g.progress >= g.repetitions ).length
		},
		totalProgress() {
			return this.goals.reduce( ( sum, g ) => sum + g.progress, 0 )
		},
		totalRepetitions() {
			return this.goals.reduce( ( sum, g ) => sum + g.repetitions, 0 )
		},
		completionPercent() {
			return this.totalRepetitions ? Math.round( ( this.totalProgress / this.totalRepetitions ) * 100 ) : 0
		},
	},
	async mounted() {
		await initializeGoals()
	},
	methods: {
		updateGoal( id, progress ) {
			const goal = this.goals.find( g => g.id === id )
			if ( goal ) goal.progress = progress
		},
		editGoal( id ) {
			console.log( 'Edit goal', id )
		},
		removeGoal( id ) {
			const index = this.goals.findIndex( g => g.id === id )
			if ( index > -1 ) this.goals.splice( index, 1 )
		},
		openFeedback() {
			const subject = encodeURIComponent( 'Weekly Goal - Feedback' )
			const body = encodeURIComponent( 'Hi,\n\nI would like to share my feedback about the Weekly Goal app:\n\n' )
			const mailtoLink = `mailto:davronai@gmail.com?subject=${subject}&body=${body}`

			// Create a temporary link element and click it (works better on iOS)
			const link = document.createElement( 'a' )
			link.href = mailtoLink
			link.target = '_blank'
			document.body.appendChild( link )
			link.click()
			document.body.removeChild( link )
		},
		addNewGoal() {
			this.$router.push( '/new-goal' )
		},
	},
}
</script>

<style lang="stylus" scoped>
.HomeView
	padding 0
	width 100%
	max-width 375px
	margin 0 auto
	background #f6f7ff
	position relative
	.goals
		margin-bottom 20px
	.header
		padding 0 24px 20px
		text-align center

		.title
			font-family 'Jost', sans-serif
			font-size 32px
			font-weight 400
			line-height 40px
			color #010101
			margin-bottom 12px

		.subtitle
			font-family 'Jost', sans-serif
			font-size 14px
			font-weight 400
			line-height 20px
			color #A0A0A0
			width 249px
			margin 0 auto

	.progressSection
		display none

	.stats
		display none

	.sendCard
		display none

	.goalList
		padding 0 23px
		margin-bottom 40px

		.emptyState
			display flex
			justify-content center
			align-items center
			padding 40px 0
			margin-bottom 20px

			.emptyIllustration
				max-width 200px
				width 100%
				height auto

	.ctaSection
		display flex
		flex-direction column
		gap 12px
		padding 0 24px
		margin-bottom 20px
</style>
