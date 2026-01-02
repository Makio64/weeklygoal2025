<template>
	<div class="HistoryView view">
		<div class="header">
			<button class="backButton" @click="goBack">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15 18L9 12L15 6" stroke="#010101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
			<div class="title">Past weeks</div>

		</div>

		<div class="content">
			<template v-if="history.length === 0">
				<div class="emptyState">
					<img
						src="/img/nothing-here.png"
						alt="No past weeks yet"
						class="emptyIllustration"
					>
					<div class="emptyTitle">No history yet</div>
					<div class="emptyText">Complete your first week to see your progress here</div>
				</div>
			</template>
			<template v-else>
				<div class="weeksList">
					<WeekCard
						v-for="(week, index) in history"
						:key="index"
						:week="week"
						@select="openWeekDetails"
					/>
				</div>
			</template>
		</div>

		<WeeklyRecap
			:show="showModal"
			:recap="selectedWeek"
			:is-history="true"
			@close="closeModal"
		/>
	</div>
</template>

<script>
import WeekCard from '@/components/WeekCard.vue'
import WeeklyRecap from '@/components/WeeklyRecap.vue'
import { animateIn, animateOut } from '@/utils/pageTransitions'
import { getWeeklyHistory } from '@/utils/weeklyReset'

export default {
	name: 'HistoryView',
	components: {
		WeekCard,
		WeeklyRecap,
	},
	data() {
		return {
			history: [],
			showModal: false,
			selectedWeek: null,
		}
	},
	async mounted() {
		animateIn( this.$el )
		this.history = await getWeeklyHistory()
	},
	methods: {
		goBack() {
			this.$router.push( '/' )
		},
		openWeekDetails( week ) {
			this.selectedWeek = week
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
			this.selectedWeek = null
		},
		beforeRouteLeave( next ) {
			animateOut( this.$el, next )
		},
	},
}
</script>

<style lang="stylus" scoped>
.HistoryView
	max-width 375px
	margin 0 auto
	background #f6f7ff
	font-family 'Jost', sans-serif
	min-height 100dvh

	.header
		display grid
		grid-template-columns 48px 1fr 48px
		align-items center
		padding 12px 24px 20px

		.backButton
			width 32px
			height 32px
			background white
			border none
			border-radius 10px
			cursor pointer
			display flex
			align-items center
			justify-content center
			box-shadow 0 2px 8px rgba(0, 0, 0, 0.04)
			transition all 0.2s
			grid-column 1
			justify-self start

			&:active
				transform scale(0.95)

		.title
			font-size 24px
			font-weight 600
			color #010101
			grid-column 2
			text-align center
			white-space nowrap

	.content
		padding 0 24px
		padding-bottom 40px

		.emptyState
			display flex
			flex-direction column
			align-items center
			justify-content center
			padding 40px 0
			text-align center

			.emptyIllustration
				max-width 160px
				width 100%
				margin-bottom 16px

			.emptyTitle
				font-size 16px
				font-weight 600
				color #010101
				margin-bottom 8px

			.emptyText
				font-size 14px
				color #A0A0A0
				max-width 240px

		.weeksList
			display flex
			flex-direction column
			gap 12px
</style>
