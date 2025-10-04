<template>
	<div class="NewGoal view">
		<!-- Step 1 -->
		<div v-if="step === 1" class="step1">
			<div class="header">
				<div class="title">New goal</div>
				<div class="subtitle">This week I will</div>
			</div>

			<!-- Selected at top -->
			<div v-if="selectedGoals.length > 0" class="selectedGoals">
				<div v-for="goal in selectedGoals" :key="goal.id" class="goalItem selected" @click="unselectGoal(goal)">
					<span class="icon">{{ goal.icon }}</span>
					<span class="name">{{ goal.name }}</span>
				</div>
			</div>

			<!-- Swipeable categories -->
			<div class="categoriesWrap">
				<div ref="categoriesEl" class="categories" :style="{ transform: `translateX(-${currentCat * 100}%)` }">
					<div v-for="(cat, idx) in categories" :key="idx" class="categoryPage">
						<div
							v-for="goal in cat.goals"
							v-show="!isSelected(goal)"
							:key="goal.id"
							class="goalItem"
							@click="selectGoal(goal)"
						>
							<span class="icon">{{ goal.icon }}</span>
							<span class="name">{{ goal.name }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Pager -->
			<div class="pager">
				<div v-for="(c, i) in categories" :key="i" class="dot" :class="{ active: i === currentCat }" @click="currentCat = i" />
			</div>

			<!-- Tips -->
			<div class="tips">
				<span class="star">⭐</span>
				<div class="text">Don't be too harsh on yourself, be it easy and you can!</div>
				<span class="star">⭐</span>
			</div>

			<button class="writeOwn" @click="writeOwn">Write your own goal!</button>
			<button class="continue" :disabled="!selectedGoals.length" @click="goStep2">Continue →</button>
		</div>

		<!-- Step 2 -->
		<div v-else-if="step === 2" class="step2">
			<div class="header">
				<div class="title">New goal</div>
				<div class="subtitle">This week I will</div>
			</div>

			<div class="goalCard">
				<div class="cardTop">
					<span class="icon">{{ current.icon }}</span>
					<span class="name">{{ current.name }}</span>
					<div class="checks">
						<div v-for="n in 5" :key="n" class="ck" :class="{ on: n <= current.reps }" />
					</div>
				</div>
				<div class="freq">
					<span>I want to do it</span>
					<div class="cnt">
						<button @click="decr">−</button>
						<input v-model.number="current.reps" type="number" min="1" max="5" readonly>
						<button @click="incr">+</button>
					</div>
					<span>times</span>
				</div>
			</div>

			<div class="illu">
				<img src="/img/toohard.png" alt="too hard">
			</div>

			<button class="success" @click="openModal">I will success →</button>
		</div>

		<!-- Modal -->
		<Modal :show="showModal" @close="showModal = false">
			<div class="modal">
				<div class="modalHead">My weekly goal lists</div>
				<div class="card">
					<div class="cardIcon">{{ current.icon }}</div>
					<div class="cardTitle">{{ current.name }}</div>
					<div class="cardSub">{{ current.reps }} times this week !</div>
					<div class="cardChecks">
						<div v-for="n in 5" :key="n" class="ck" :class="{ on: n <= current.reps }" />
					</div>
					<div class="cardTxt">Remember, what give you the will to achieve your goals is when they feel easy to achieve!</div>
					<button class="btn" @click="confirm">I will do it!</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal.vue'
import { goals } from '@/store'

export default {
	name: 'NewGoal',
	components: { Modal },
	data() {
		return {
			step: 1,
			currentCat: 0,
			selectedGoals: [],
			currentIdx: 0,
			showModal: false,
			touchX: 0,
			categories: [
				{
					goals: [
						{ id: 1, icon: '🥕', name: 'Cook vegetarian food', reps: 3 },
						{ id: 2, icon: '🌱', name: 'Read more', reps: 5 },
						{ id: 3, icon: '💅', name: 'Pamper myself', reps: 2 },
						{ id: 4, icon: '🥕', name: 'Cook vegetarian food', reps: 3 },
					],
				},
				{
					goals: [
						{ id: 5, icon: '🏃', name: 'Do some sport', reps: 3 },
						{ id: 6, icon: '🧘', name: 'Meditate more', reps: 5 },
						{ id: 7, icon: '🥗', name: 'Have meals less diet', reps: 4 },
						{ id: 8, icon: '🚴', name: 'Cycling', reps: 3 },
					],
				},
				{
					goals: [
						{ id: 9, icon: '💼', name: 'Work on personal project', reps: 3 },
						{ id: 10, icon: '📚', name: 'Read books', reps: 5 },
						{ id: 11, icon: '✍️', name: 'Write journal', reps: 4 },
						{ id: 12, icon: '🎨', name: 'Practice drawing', reps: 3 },
					],
				},
			],
		}
	},
	computed: {
		current() {
			return this.selectedGoals[this.currentIdx] || {}
		},
	},
	mounted() {
		this.$refs.categoriesEl?.addEventListener( 'touchstart', this.onTouchStart )
		this.$refs.categoriesEl?.addEventListener( 'touchmove', this.onTouchMove )
		this.$refs.categoriesEl?.addEventListener( 'touchend', this.onTouchEnd )
	},
	beforeUnmount() {
		this.$refs.categoriesEl?.removeEventListener( 'touchstart', this.onTouchStart )
		this.$refs.categoriesEl?.removeEventListener( 'touchmove', this.onTouchMove )
		this.$refs.categoriesEl?.removeEventListener( 'touchend', this.onTouchEnd )
	},
	methods: {
		isSelected( g ) {
			return this.selectedGoals.some( s => s.id === g.id )
		},
		selectGoal( g ) {
			if ( !this.isSelected( g ) ) {
				this.selectedGoals.push( { ...g } )
			}
		},
		unselectGoal( g ) {
			const idx = this.selectedGoals.findIndex( s => s.id === g.id )
			if ( idx > -1 ) this.selectedGoals.splice( idx, 1 )
		},
		onTouchStart( e ) {
			this.touchX = e.touches[0].clientX
		},
		onTouchMove( e ) {
			const diff = this.touchX - e.touches[0].clientX
			if ( diff > 50 && this.currentCat < this.categories.length - 1 ) {
				this.currentCat++
				this.touchX = e.touches[0].clientX
			} else if ( diff < -50 && this.currentCat > 0 ) {
				this.currentCat--
				this.touchX = e.touches[0].clientX
			}
		},
		onTouchEnd() {},
		writeOwn() {
			const name = prompt( 'Enter your goal:' )
			if ( name ) {
				const g = { id: Date.now(), icon: '📝', name, reps: 3 }
				this.selectedGoals.push( g )
			}
		},
		goStep2() {
			if ( this.selectedGoals.length ) {
				this.step = 2
				this.currentIdx = 0
			}
		},
		incr() {
			if ( this.current.reps < 5 ) this.current.reps++
		},
		decr() {
			if ( this.current.reps > 1 ) this.current.reps--
		},
		openModal() {
			this.showModal = true
		},
		confirm() {
			goals.value.push( {
				id: this.current.id,
				name: this.current.name,
				icon: this.current.icon,
				repetitions: this.current.reps,
				progress: 0,
			} )
			if ( this.currentIdx < this.selectedGoals.length - 1 ) {
				this.currentIdx++
				this.showModal = false
			} else {
				this.$router.push( '/' )
			}
		},
	},
}
</script>

<style lang="stylus" scoped>
.NewGoal
	background #F6F7FF
	min-height 100vh
	padding 20px
	display flex
	flex-direction column

	.header
		text-align center
		margin-bottom 30px

		.title
			font-family 'Jost', sans-serif
			font-size 32px
			font-weight 400
			color #010101
			margin-bottom 8px

		.subtitle
			font-family 'Jost', sans-serif
			font-size 14px
			color #A0A0A0

	.step1
		flex 1
		display flex
		flex-direction column

	.selectedGoals
		margin-bottom 16px

	.goalItem
		background #FFF
		border 1px solid #F3F3FF
		border-radius 6px
		padding 12px 16px
		margin-bottom 8px
		display flex
		align-items center
		gap 12px
		cursor pointer
		transition 0.2s

		&.selected
			background #E8EAFF
			border-color #5D73E7

		&:active
			transform scale(0.98)

		.icon
			font-size 20px

		.name
			font-family 'Jost', sans-serif
			font-size 16px
			flex 1

	.categoriesWrap
		overflow hidden
		flex 1
		margin-bottom 20px

	.categories
		display flex
		transition transform 0.3s

	.categoryPage
		min-width 100%
		display flex
		flex-direction column

	.pager
		display flex
		justify-content center
		gap 8px
		margin-bottom 20px

		.dot
			width 8px
			height 8px
			border-radius 50%
			background #D1D5DB
			cursor pointer
			transition 0.2s

			&.active
				background #5D73E7
				width 24px
				border-radius 4px

	.tips
		display flex
		align-items center
		justify-content center
		gap 12px
		margin-bottom 20px
		padding 16px

		.star
			font-size 20px

		.text
			font-family 'Jost', sans-serif
			font-size 14px
			color #666
			text-align center
			max-width 250px

	.writeOwn
		width 100%
		padding 14px
		background #FFF
		border 2px dashed #5D73E7
		border-radius 6px
		font-family 'Jost', sans-serif
		font-size 16px
		color #5D73E7
		cursor pointer
		margin-bottom 16px

		&:active
			transform scale(0.98)

	.continue
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

		&:disabled
			opacity 0.5

		&:not(:disabled):active
			transform scale(0.98)

	.step2
		flex 1
		display flex
		flex-direction column

	.goalCard
		background #FFF
		border 1px solid #F3F3FF
		border-radius 6px
		padding 20px
		margin-bottom 30px

		.cardTop
			display flex
			align-items center
			gap 12px
			margin-bottom 20px

			.icon
				font-size 24px

			.name
				font-family 'Jost', sans-serif
				font-size 16px
				flex 1

			.checks
				display flex
				gap 4px

				.ck
					width 12px
					height 12px
					border 2px solid #E2E4F0
					border-radius 2px

					&.on
						background #5D73E7
						border-color #5D73E7

		.freq
			display flex
			align-items center
			justify-content center
			gap 12px
			font-family 'Jost', sans-serif
			font-size 16px

			.cnt
				display flex
				gap 8px

				button
					width 32px
					height 32px
					border-radius 50%
					border 1px solid #E2E4F0
					background #FFF
					font-size 20px
					cursor pointer

					&:active
						transform scale(0.9)

				input
					width 40px
					text-align center
					border none
					font-family 'Jost', sans-serif
					font-size 18px
					font-weight 600

	.illu
		flex 1
		display flex
		align-items center
		justify-content center
		margin-bottom 30px

		img
			max-width 200px

	.success
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

		&:active
			transform scale(0.98)

	.modal
		background linear-gradient(135deg, #FFB399 0%, #FFD4A3 100%)
		min-height 400px
		display flex
		flex-direction column
		padding-top 24px

		.modalHead
			font-family 'Jost', sans-serif
			font-size 20px
			color rgba(255, 255, 255, 0.6)
			text-align center
			margin-bottom 24px

		.card
			background rgba(255, 255, 255, 0.9)
			border-radius 12px
			padding 32px 24px
			margin 0 16px 24px
			text-align center

			.cardIcon
				font-size 48px
				margin-bottom 16px

			.cardTitle
				font-family 'Jost', sans-serif
				font-size 24px
				font-weight 500
				color #000
				margin-bottom 8px

			.cardSub
				font-family 'Jost', sans-serif
				font-size 16px
				color #666
				margin-bottom 16px

			.cardChecks
				display flex
				justify-content center
				gap 8px
				margin-bottom 24px

				.ck
					width 16px
					height 16px
					border 2px solid #FFA07A
					border-radius 3px

					&.on
						background #FFA07A

			.cardTxt
				font-family 'Jost', sans-serif
				font-size 14px
				line-height 20px
				color #666
				margin-bottom 24px

			.btn
				width 100%
				padding 14px
				background #FFF
				border none
				border-radius 6px
				font-family 'Jost', sans-serif
				font-size 16px
				font-weight 500
				color #FF8B6A
				cursor pointer

				&:active
					transform scale(0.98)
</style>
