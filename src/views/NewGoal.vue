<template>
	<div class="NewGoal view">
		<!-- Step 1 -->
		<div v-if="step === 1" class="step1">
			<div class="header">
				<div class="title">This week I will do</div>
			</div>

			<!-- Selected goal at top (using Goal component style) -->
			<div v-if="selectedGoal" class="selectedGoalWrap">
				<div class="selectedGoal">
					<div class="goalContent">
						<div class="iconName">
							<span class="icon">{{ selectedGoal.icon }}</span>
							<span class="name">{{ selectedGoal.name }}</span>
						</div>
						<div v-if="showRepetitionSelector" class="checks">
							<CheckGoal
								v-for="i in selectedGoal.reps"
								:key="i"
								:done="false"
							/>
						</div>
					</div>
					<div class="progressBar">
						<div class="progressFill" :style="{ width: '0%' }" />
					</div>
				</div>

				<!-- Repetition selector (shown after first continue click) -->
				<div v-if="showRepetitionSelector" class="repetitionSelector">
					<div class="repLabel">I want to do it</div>
					<div class="repCounter">
						<button class="repBtn" @click="decr">−</button>
						<span class="repValue">{{ selectedGoal.reps }}</span>
						<button class="repBtn" @click="incr">+</button>
					</div>
					<div class="repLabel">times</div>
				</div>
			</div>

			<!-- <input v-if="!showRepetitionSelector" v-model="customGoal" class="writeOwn" placeholder="Write your own goal!" @keyup.enter="addCustomGoal"> -->

			<!-- Illustration (shown when repetition selector is visible) -->
			<div v-if="showRepetitionSelector" class="illustrationWrap">
				<img src="/img/toohard.png" alt="You can do it!" class="illustration">
			</div>

			<!-- Goals organized by category -->
			<div v-if="!showRepetitionSelector" class="categoriesWrap">
				<div v-for="category in categoriesWithGoals" :key="category.id" class="categorySection">
					<div
						class="categoryTitle"
						:style="{
							'--cat-color-light': category.color + '40',
							'--cat-color-lighter': category.color + '15',
							'border-color': category.color + '60'
						}"
					>
						<span class="categoryIcon">{{ category.icon }}</span>
						<span class="categoryName">{{ category.name }}</span>
						<div class="categoryLine" :style="{ backgroundColor: category.color }" />
					</div>
					<div class="categoryButtons">
						<button
							v-for="(goal, idx) in category.goals"
							:key="idx"
							class="categoryPill"
							:class="{ selected: isGoalSelected(goal, category.id) }"
							@click="selectGoal(goal, category.id)"
						>
							{{ goal.icon }} {{ goal.name }}
						</button>
					</div>
				</div>
			</div>

			<button class="continue" :disabled="!selectedGoal" @click="handleContinue">
				{{ showRepetitionSelector ? 'I will success' : 'Continue' }}
			</button>
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
				<div class="card">
					<!-- <div class="cardIcon">{{ current.icon }}</div> -->
					<div class="cardTitle">{{ current.name }}</div>
					<div class="cardSub">{{ current.reps }} times this week !</div>
					<div class="cardChecks">
						<div v-for="n in current.reps" :key="n" class="ck" :class="{ on: n <= current.reps }" />
					</div>
					<div class="cardTxt">Remember what goal you want to acheive and why you want to acheive it. The best motivation is you !</div>
					<button class="btn" @click="confirm">I will do it!</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
import CheckGoal from '@/components/CheckGoal.vue'
import Modal from '@/components/Modal.vue'
import categoriesGoals from '@/data/categories-goals.json'
import { goals } from '@/store'
import { saveAndNotify } from '@/utils/goalHelpers'

export default {
	name: 'NewGoal',
	components: { Modal, CheckGoal },
	data() {
		return {
			step: 1,
			selectedGoal: null,
			customGoal: '',
			showModal: false,
			showRepetitionSelector: false,
			categoriesWithGoals: categoriesGoals,
		}
	},
	computed: {
		current() {
			return this.selectedGoal || {}
		},
	},
	mounted() {
		// Select random goal by default
		const allGoals = this.categoriesWithGoals.flatMap( cat =>
			cat.goals.map( g => ( { ...g, category: cat.id } ) )
		)
		const randomIndex = Math.floor( Math.random() * allGoals.length )
		this.selectedGoal = { ...allGoals[randomIndex], id: Date.now(), reps: 1 }
	},
	methods: {
		isGoalSelected( goal, categoryId ) {
			return this.selectedGoal &&
				this.selectedGoal.name === goal.name &&
				this.selectedGoal.icon === goal.icon &&
				this.selectedGoal.category === categoryId
		},
		selectGoal( goal, categoryId ) {
			this.selectedGoal = { ...goal, category: categoryId, id: Date.now(), reps: 1 }
		},
		addCustomGoal() {
			if ( this.customGoal.trim() ) {
				this.selectedGoal = {
					id: Date.now(),
					icon: '📝',
					name: this.customGoal.trim(),
					reps: 1,
				}
				this.customGoal = ''
			}
		},
		handleContinue() {
			if ( !this.showRepetitionSelector ) {
				// First click: show repetition selector
				this.showRepetitionSelector = true
			} else {
				// Second click: open modal
				this.openModal()
			}
		},
		goStep2() {
			if ( this.selectedGoal ) {
				this.step = 2
			}
		},
		incr() {
			if ( this.selectedGoal.reps < 5 ) this.selectedGoal.reps++
		},
		decr() {
			if ( this.selectedGoal.reps > 1 ) this.selectedGoal.reps--
		},
		openModal() {
			this.showModal = true
		},
		async confirm() {
			goals.value.push( {
				id: this.current.id,
				name: this.current.name,
				icon: this.current.icon,
				category: this.current.category,
				repetitions: this.current.reps,
				progress: 0,
			} )
			await saveAndNotify()
			this.$router.push( '/' )
		},
	},
}
</script>

<style lang="stylus" scoped>
.NewGoal
	max-width 375px
	margin 0 auto
	padding 0
	display flex
	flex-direction column

	.header
		text-align center
		margin-bottom 20px
		flex-shrink 0

		.title
			font-family 'Jost', sans-serif
			font-size 32px
			line-height 40px
			color #010101
			margin-bottom 0

		.subtitle
			font-family 'Jost', sans-serif
			font-size 20px
			line-height 28px
			color #888
			margin-top 20px

	.step1, .step2
		height calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) + 10px)
		display flex
		flex-direction column
		padding-bottom env(safe-area-inset-bottom)

	.selectedGoalWrap
		margin-bottom 16px
		flex-shrink 0

	.selectedGoal
		background #F6F6F6
		border 1px solid #F3F3FF
		border-radius 6px
		overflow hidden

		.goalContent
			padding 0 16px
			min-height 64px
			display flex
			align-items center
			justify-content space-between
			gap 12px

			.iconName
				display flex
				align-items center
				gap 8px
				flex 1

				.icon
					font-size 20px

				.name
					font-family 'Nunito', sans-serif
					font-size 16px
					font-weight 600
					color #3445E1

			.checks
				display flex
				gap 4px
				flex-shrink 0

		.progressBar
			height 6px
			background #E2E4F0
			width 100%

			.progressFill
				height 100%
				background #3445E1
				transition width 0.3s

	.repetitionSelector
		padding 24px 16px
		display flex
		align-items center
		justify-content center
		gap 12px

		.repLabel
			font-family 'Jost', sans-serif
			font-size 16px
			color #000

		.repCounter
			display flex
			align-items center
			gap 12px

			.repBtn
				width 36px
				height 36px
				border-radius 50%
				border 1px solid #E2E4F0
				background #FFF
				font-size 24px
				color #3445E1
				cursor pointer
				display flex
				align-items center
				justify-content center
				transition transform 0.1s

				&:active
					transform scale(0.9)

			.repValue
				font-family 'Jost', sans-serif
				font-size 24px
				font-weight 600
				color #3445E1
				min-width 30px
				text-align center

	.illustrationWrap
		flex 1
		display flex
		align-items center
		justify-content center
		padding 20px
		min-height 250px

		.illustration
			max-width 200px
			width 100%

	.categoriesWrap
		flex 1
		overflow-y auto
		overflow-x hidden
		padding-right 4px
		padding-bottom 20px
		min-height 0

		&::-webkit-scrollbar
			width 4px

		&::-webkit-scrollbar-track
			background #F0F0F0
			border-radius 2px

		&::-webkit-scrollbar-thumb
			background #D0D0D0
			border-radius 2px

	.categorySection
		margin-bottom 24px

		.categoryTitle
			display flex
			align-items start
			gap 8px
			margin-bottom 12px
			position relative
			padding-left 10px
			padding-top 20px
			padding-bottom 10px
			// border-radius 50px
			// border 1px solid var(--cat-color-light)
			// background linear-gradient(135deg, var(--cat-color-light) 0%, var(--cat-color-lighter) 100%)

			.categoryIcon
				font-size 20px

			.categoryName
				// font-family 'Jost', sans-serif
				font-size 18px
				font-weight 600
				color #333

			.categoryLine
				display none

	.categoryButtons
		display flex
		flex-wrap wrap
		gap 8px

		.categoryPill
			background #FFF
			border 1px solid #E2E4F0
			border-radius 4px
			padding 10px 13px
			font-family 'Nunito', sans-serif
			font-size 16px
			font-weight 600
			color #3445E1
			cursor pointer
			transition all 0.2s
			white-space nowrap

			&.selected
				background #3445E1
				color #FFF
				border-color #3445E1

			&:active
				transform scale(0.95)

	.writeOwn
		width 100%
		padding 12px
		background #FFF
		border 1px solid #E2E4F0
		border-radius 4px
		font-family 'Jost', sans-serif
		font-size 16px
		line-height 28px
		color #9D9D9D
		text-align center
		margin-bottom 16px

		&::placeholder
			color #9D9D9D

	.continue
		width 100%
		padding 20px
		background #3445E1
		border none
		border-radius 4px
		box-shadow 0 4px 30px rgba(0, 0, 0, 0.24)
		font-family 'Jost', sans-serif
		font-size 20px
		line-height 16px
		color #FFF
		cursor pointer
		margin-top 20px
		margin-bottom 20px
		flex-shrink 0

		&:disabled
			opacity 0.5

		&:not(:disabled):active
			transform scale(0.98)

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
		background linear-gradient(261deg, #FFBF84 16.31%, #FFB9A3 76.83%)
		min-height 70vh
		display flex
		flex-direction column
		align-items center
		justify-content center
		padding-top 24px

		.modalHead
			font-family 'Jost', sans-serif
			font-size 20px
			color rgba(255, 255, 255, 0.6)
			text-align center
			margin-bottom 24px

		.card
			padding 32px 24px
			margin 0 16px 24px
			text-align center

			.cardIcon
				font-size 48px
				margin-bottom 16px

			.cardTitle
				font-family 'Jost', sans-serif
				font-size 40px
				line-height 1.2
				font-weight 500
				color #fff
				margin-bottom 40px

			.cardSub
				font-family 'Jost', sans-serif
				font-size 20px
				color #fff
				margin-bottom 16px

			.cardChecks
				display flex
				justify-content center
				gap 8px
				margin-bottom 60px

				.ck
					width 16px
					height 16px
					border 2px solid #FFF
					border-radius 3px

			.cardTxt
				font-family 'Jost', sans-serif
				font-size 16px
				line-height 20px
				color #fff
				margin-bottom 30px

			.btn
				width 100%
				padding 16px
				background #FFF
				border none
				border-radius 6px
				font-family 'Jost', sans-serif
				font-size 20px
				font-weight 500
				color #FFBF84
				cursor pointer

				&:active
					transform scale(0.98)
</style>
