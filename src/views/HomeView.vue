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

			<div class="methodBlock" :class="{ expanded: showLearnMore }" @click="showLearnMore = !showLearnMore">
				<div class="methodTeaser">
					<span class="methodTitle">Why it works</span>
					<p class="methodIntro">
						Studies show that small, manageable weekly goals lead to higher success rates by breaking big ambitions into actionable steps.
					</p>
					<span class="methodHint">{{ showLearnMore ? 'Close' : 'Learn more' }}</span>
				</div>

				<transition name="expand">
					<div v-if="showLearnMore" class="methodContent">
						<div 
							v-for="(benefit, index) in benefits" 
							:key="index" 
							class="benefitItem"
						>
							<span class="benefitIcon" v-html="benefit.icon" />
							<div class="benefitText">
								<strong>{{ benefit.title }}</strong>
								<span>{{ benefit.text }}</span>
							</div>
						</div>
					</div>
				</transition>
			</div>

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
import { animateIn, animateOut } from '@/utils/pageTransitions'
import { generateFakeRecap, performWeeklyReset, shouldResetWeek } from '@/utils/weeklyReset'

export default {
	name: 'HomeView',
	beforeRouteLeave( next ) {
		swipedGoalId.value = null
		animateOut( this.$el, next )
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
			showLearnMore: false,
			benefits: [
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
					title: 'A week is the perfect pace',
					text: 'Long enough for real life, short enough to stay focused.'
				},
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>',
					title: 'Habits are built with repeats',
					text: 'Small actions done often become automatic over time.'
				},
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>',
					title: 'Less pressure, more consistency',
					text: 'You don\'t need perfect days—just enough good ones.'
				},
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
					title: 'Clear goals make action easier',
					text: '"3 sessions" is simpler to follow than "do more".'
				},
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
					title: 'Tracking keeps you honest',
					text: 'Seeing progress makes it easier to continue.'
				},
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>',
					title: 'Small habits power big results',
					text: 'Weekly wins add up and move long-term goals forward.'
				},
				{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>',
					title: 'Fresh start, every week',
					text: 'Review, adjust, and start again—no guilt, just momentum.'
				}
			],
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
		document.getElementById( 'app' )?.scrollTo( { top: 0, behavior: 'auto' } )
		animateIn( this.$el )
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
				this.triggerDebugRecap()
			}
		},
		triggerDebugRecap() {
			this.weeklyRecap = generateFakeRecap()
			this.showRecapModal = true
		},
		beforeRouteLeave( next ) {
			swipedGoalId.value = null
			animateOut( this.$el, next )
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
	min-height 100dvh

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

		.methodBlock
			margin-top 20px
			padding 20px 24px
			background linear-gradient(135deg, #d3f9d8 0%, #dbeafe 100%)
			border-radius 16px
			cursor pointer
			transition all 0.3s ease
			max-width 320px
			margin-left auto
			margin-right auto

			&:hover
				transform translateY(-2px)

			.methodTeaser
				display flex
				flex-direction column
				gap 10px

				.methodTitle
					font-size 18px
					font-weight 600
					color #2d2d3a
					text-align center

				.methodIntro
					font-size 14px
					line-height 1.7
					color #3d3d4d
					margin 0
					text-align left

				.methodHint
					font-size 13px
					font-weight 500
					color #7c6bc4
					margin-top 6px
					text-align left

			.methodContent
				margin-top 18px
				padding-top 18px
				border-top 1px solid rgba(108, 92, 231, 0.12)
				display flex
				flex-direction column
				gap 16px

				.benefitItem
					display flex
					gap 12px
					align-items flex-start

					.benefitIcon
						width 24px
						height 24px
						flex-shrink 0
						color #6C5CE7
						display flex
						align-items center
						justify-content center

						:deep(svg)
							width 100%
							height 100%

					.benefitText
						display flex
						flex-direction column
						gap 2px
						text-align left

						strong
							font-size 15px
							font-weight 600
							color #2d2d3a
							line-height 1.4

						span
							font-size 14px
							line-height 1.6
							color #4a4a5a

			.expand-enter-active,
			.expand-leave-active
				transition all 0.3s ease
				overflow hidden

			.expand-enter-from,
			.expand-leave-to
				opacity 0
				margin-top 0
				padding-top 0

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
