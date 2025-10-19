<template>
	<div class="HomeView view">
		<div class="header">
			<div class="title">WeeklyGoal</div>
			<div class="subtitle">Simple step leads to higher goals</div>
		</div>

		<div class="progressSection">
			<div class="progressText">{{ completionPercent }}% done!</div>
			<div class="progressBar">
				<div class="progressFill" :style="{ width: completionPercent + '%' }" />
			</div>
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
						:id="goal.id"
						:key="goal.id"
						ref="goalRefs"
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
import { goals, goalSwiped, initializeGoals } from '@/store'

export default {
	name: 'HomeView',
	data() {
		return {
			goals,
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
		goalSwiped.add( this.handleGoalSwiped )
		await initializeGoals()
	},
	beforeUnmount() {
		goalSwiped.remove( this.handleGoalSwiped )
	},
	methods: {
		handleGoalSwiped( id ) {
			const refs = this.$refs.goalRefs || []
			const goalComponents = Array.isArray( refs ) ? refs : [refs]
			goalComponents.forEach( ( goalComponent ) => {
				if ( !goalComponent ) return
				if ( goalComponent.$props?.id !== id ) {
					goalComponent.closeSwipe?.()
				}
			} )
		},
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
			margin-bottom 5px

		.subtitle
			font-family 'Jost', sans-serif
			font-size 14px
			font-weight 400
			line-height 20px
			color #A0A0A0
			width 249px
			margin 0 auto

	.progressSection
		padding 0 24px 24px
		width calc(100% - 50px)

		.progressBar
			width 100%
			height 12px
			background #E8E9F3
			border-radius 100px
			overflow hidden
			margin-bottom 8px

			.progressFill
				height 100%
				background linear-gradient(90deg, #6C5CE7 0%, #A29BFE 100%)
				border-radius 100px
				transition width 0.3s ease

		.progressText
			font-family 'Jost', sans-serif
			font-size 14px
			font-weight 500
			color #6C5CE7
			text-align center

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
