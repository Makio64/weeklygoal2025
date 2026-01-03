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
				<HistoryStats
					:average-completion="averageCompletion"
					:total-weeks="totalWeeks"
					:total-tasks-completed="totalTasksCompleted"
					:best-week-percent="bestWeekPercent"
				/>

				<div class="chartSection">
					<h3 class="sectionTitle">Weekly Progress</h3>
					<HistoryTrendChart
						:data="chartData"
						@point-tap="openWeekDetails"
					/>
				</div>

				<div class="weekListSection">
					<h3 class="sectionTitle">All Weeks</h3>
					<div class="compactWeeksList">
						<CompactWeekRow
							v-for="(week, index) in history"
							:key="index"
							:week="week"
							@select="openWeekDetails"
						/>
					</div>
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
import CompactWeekRow from '@/components/CompactWeekRow.vue'
import HistoryStats from '@/components/HistoryStats.vue'
import HistoryTrendChart from '@/components/HistoryTrendChart.vue'
import WeeklyRecap from '@/components/WeeklyRecap.vue'
import { animateIn, animateOut } from '@/utils/pageTransitions'
import { getWeeklyHistory } from '@/utils/weeklyReset'

export default {
	name: 'HistoryView',
	components: {
		HistoryStats,
		HistoryTrendChart,
		CompactWeekRow,
		WeeklyRecap,
	},
	data() {
		return {
			history: [],
			showModal: false,
			selectedWeek: null,
		}
	},
	computed: {
		averageCompletion() {
			if ( this.history.length === 0 ) return 0
			const sum = this.history.reduce( ( acc, w ) => acc + ( w.stats?.completionPercent || 0 ), 0 )
			return Math.round( sum / this.history.length )
		},
		totalWeeks() {
			return this.history.length
		},
		totalTasksCompleted() {
			return this.history.reduce( ( acc, w ) => acc + ( w.stats?.completedTasks || 0 ), 0 )
		},
		bestWeekPercent() {
			if ( this.history.length === 0 ) return 0
			return Math.max( ...this.history.map( w => w.stats?.completionPercent || 0 ) )
		},
		chartData() {
			return [...this.history].reverse().map( ( week, index ) => ( {
				index,
				percent: week.stats?.completionPercent || 0,
				week,
				label: this.formatShortDate( week.weekStart ),
			} ) )
		},
	},
	async mounted() {
		document.getElementById( 'app' )?.scrollTo( { top: 0, behavior: 'auto' } )
		animateIn( this.$el )
		this.history = await getWeeklyHistory()
	},
	methods: {
		formatShortDate( dateStr ) {
			if ( !dateStr ) return ''
			const date = new Date( dateStr )
			return date.toLocaleDateString( 'en-US', { month: 'short', day: 'numeric' } )
		},
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

	.header
		position relative
		display flex
		align-items center
		justify-content center
		padding 12px 24px 20px
		min-height 44px

		.backButton
			position absolute
			left 24px
			top 12px
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
			z-index 10

			&:active
				transform scale(0.95)

		.title
			font-size 24px
			font-weight 600
			color #010101
			text-align center
			width 100%
			padding 0 80px
			box-sizing border-box

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

		.sectionTitle
			font-size 14px
			font-weight 600
			color #010101
			margin-bottom 12px

		.chartSection
			margin-bottom 24px

		.weekListSection
			.compactWeeksList
				display flex
				flex-direction column
				gap 8px
</style>
