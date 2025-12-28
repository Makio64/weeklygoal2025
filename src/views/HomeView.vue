<template>
	<div class="HomeView view" @pointerdown="handleGlobalPointerDown">
		<div class="header">
			<div class="title">WeeklyGoal</div>
			<div class="subtitle">Small steps lead to bigger goals</div>
		</div>

		<div class="progressSection">
			<div class="progressText"> {{ goalsDone }}/{{ goals.length }} goals complete · {{ completionPercent }}% done!</div>
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
						:name="goal.name"
						:icon="goal.icon"
						:category="goal.category"
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
			<HistoryButton @click="$router.push('/history')" />
			<NotificationToggle />
		</div>

		<WeeklyRecap :show="showRecapModal" :recap="weeklyRecap" @close="closeRecapModal" />
	</div>
</template>

<script>
import HistoryButton from '@/components/HistoryButton.vue'
import WeeklyRecap from '@/components/WeeklyRecap.vue'
import { reset as resetMouse } from '@/makio/utils/input/mouse'
import { goals, initializeGoals, saveGoals, swipedGoalId } from '@/store'
import { createGoalsSnapshot, handleGoalChange } from '@/utils/goalHelpers'
import notificationManager from '@/utils/notifications'
import { generateFakeRecap, performWeeklyReset, shouldResetWeek } from '@/utils/weeklyReset'

export default {
	name: 'HomeView',
	beforeRouteLeave( next ) {
		swipedGoalId.value = null
		next()
	},
	components: {
		HistoryButton,
		WeeklyRecap,
	},
	data() {
		return {
			goals,
			previousGoalsSnapshot: null,
			showRecapModal: false,
			weeklyRecap: null,
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
		swipedGoalId.value = null
		resetMouse()
		
		await initializeGoals()
		await notificationManager.init()

		// Check if we need to reset the week
		await this.checkWeeklyReset()

		// Take initial snapshot for detecting significant changes
		this.previousGoalsSnapshot = createGoalsSnapshot()

		// Add keyboard listener for debug
		window.addEventListener( 'keydown', this.handleKeyPress )
	},
	beforeUnmount() {
		swipedGoalId.value = null
		window.removeEventListener( 'keydown', this.handleKeyPress )
	},
	methods: {
		handleGlobalPointerDown( e ) {
			// If clicking outside any goal, close swiped goal
			if ( swipedGoalId.value !== null && !e.target.closest( '.Goal' ) ) {
				swipedGoalId.value = null
			}
		},
		async onGoalChange() {
			this.previousGoalsSnapshot = await handleGoalChange( this.previousGoalsSnapshot )
		},
		async updateGoal( id, progress ) {
			const goal = this.goals.find( g => g.id === id )
			if ( goal ) {
				goal.progress = progress
				await saveGoals()
				// Keep notification content up-to-date with progress changes
				await notificationManager.onGoalsChanged()
			}
		},
		editGoal( id ) {
			this.$router.push( `/new-goal?edit=${id}` )
		},
		async removeGoal( id ) {
			const index = this.goals.findIndex( g => g.id === id )
			if ( index > -1 ) {
				this.goals.splice( index, 1 )
				await this.onGoalChange()
			}
		},
		addNewGoal() {
			this.$router.push( '/new-goal' )
		},
		async checkWeeklyReset() {
			const needsReset = await shouldResetWeek()
			if ( needsReset ) {
				this.weeklyRecap = await performWeeklyReset()
				await saveGoals()
				this.showRecapModal = true
			}
		},
		closeRecapModal() {
			this.showRecapModal = false
		},
		handleKeyPress( e ) {
			// Debug: Press 's' to show recap modal with fake data
			if ( e.key === 's' || e.key === 'S' ) {
				this.weeklyRecap = generateFakeRecap()
				this.showRecapModal = true
			}
		},
	},
}
</script>

<style lang="stylus" scoped>
.HomeView
	max-width 375px
	margin 0 auto
	background #f6f7ff
	font-family 'Jost', sans-serif
	min-height 100vh

	.header, .progressSection, .ctaSection
		padding 0 24px

	.header
		padding-bottom 20px
		text-align center

		.title
			font-size 32px
			line-height 40px
			color #010101
			margin-bottom 5px

		.subtitle
			font-size 14px
			line-height 20px
			color #A0A0A0
			width 249px
			margin 0 auto

	.progressSection
		padding-bottom 24px
		width calc(100% - 50px)

		.progressBar
			height 12px
			background #E8E9F3
			border-radius 100px
			overflow hidden
			margin-bottom 8px

			.progressFill
				height 100%
				background linear-gradient(90deg, #6C5CE7 0%, #A29BFE 100%)
				transition width 0.3s

		.progressText
			font-size 14px
			font-weight 500
			color #6C5CE7
			text-align center

	.goalList
		padding 0 23px
		margin-bottom 40px

		.goals
			display flex
			flex-direction column
			gap 12px
			margin-bottom 20px

		.emptyState
			display flex
			justify-content center
			padding 40px 0
			margin-bottom 20px

			.emptyIllustration
				max-width 200px
				width 100%

	.ctaSection
		display flex
		flex-direction column
		gap 12px
		margin-bottom 20px
		padding 0 23px
		box-sizing border-box
		width 100%
		max-width 375px
</style>
