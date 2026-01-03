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
							:class="{
								selected: isGoalSelected(goal, category.id),
								inList: isGoalInList(goal, category.id)
							}"
							@click="selectGoal(goal, category.id)"
						>
							{{ goal.icon }} {{ goal.name }}
						</button>
						<button class="categoryPill addBtn" @click="openAddModal(category.id)">
							+
						</button>
					</div>
				</div>
			</div>

			<button class="continue" :disabled="!selectedGoal" @click="handleContinue">
				{{ continueLabel }}
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
						<input v-model.number="current.reps" type="number" min="1" max="6" readonly>
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

		<!-- Add Custom Goal Modal -->
		<Modal :show="showAddModal" @close="closeAddModal">
			<div class="modal addModal">
				<div class="card">
					<div class="cardTitle">New Goal</div>
					<div class="cardSubtitle">Create something meaningful to you</div>

					<div class="inputGroup">
						<button class="emojiButton" @click="showEmojiPicker = true">
							{{ newGoalEmoji }}
						</button>
						<input
							v-model="newGoalName"
							placeholder="Goal Name"
							class="nameInput"
							@keyup.enter="confirmAddGoal"
						>
						<EmojiPicker
							v-if="showEmojiPicker"
							@select="selectEmoji"
							@close="showEmojiPicker = false"
						/>
					</div>

					<button class="btn" :disabled="!newGoalName" @click="confirmAddGoal">Add</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
import CheckGoal from '@/components/CheckGoal.vue'
import EmojiPicker from '@/components/EmojiPicker.vue'
import Modal from '@/components/Modal.vue'
import categoriesGoals from '@/data/categories-goals.json'
import { addCustomGoal, customGoals, goals, initializeCustomGoals } from '@/store'
import { saveAndNotify } from '@/utils/goalHelpers'
import { animateIn, animateOut } from '@/utils/pageTransitions'

const createUniqueGoalId = () => {
	const used = new Set( goals.value.map( g => g.id ) )
	let id = Date.now() * 1000 + Math.floor( Math.random() * 1000 )
	while ( used.has( id ) ) id++
	return id
}

export default {
	name: 'NewGoal',
	components: { Modal, CheckGoal, EmojiPicker },
	data() {
		return {
			step: 1,
			selectedGoal: null,
			customGoal: '',
			showModal: false,
			showRepetitionSelector: false,
			categoriesWithGoals: categoriesGoals,
			isEditMode: false,
			editGoalId: null,
			showAddModal: false,
			showEmojiPicker: false,
			addingToCategoryId: null,
			newGoalName: '',
			newGoalEmoji: '',
		}
	},
	computed: {
		current() {
			return this.selectedGoal || {}
		},
		continueLabel() {
			if ( !this.showRepetitionSelector ) return 'Continue'
			return this.isEditMode ? 'Save' : 'I will success'
		},
	},
	async mounted() {
		document.getElementById( 'app' )?.scrollTo( { top: 0, behavior: 'auto' } )
		animateIn( this.$el )
		// Load custom goals and merge with static categories
		await initializeCustomGoals()
		this.categoriesWithGoals = categoriesGoals.map( cat => ( {
			...cat,
			goals: [...cat.goals, ...( customGoals.value[cat.id] || [] )],
		} ) )

		// Edit mode: /new-goal?edit=<id>
		const params = new URLSearchParams( window.location.search || '' )
		const editParam = params.get( 'edit' )
		const editId = editParam ? Number( editParam ) : null
		if ( Number.isFinite( editId ) ) {
			const g = goals.value.find( gg => gg.id === editId )
			if ( g ) {
				this.isEditMode = true
				this.editGoalId = editId
				this.selectedGoal = {
					id: g.id,
					name: g.name,
					icon: g.icon,
					category: g.category,
					reps: g.repetitions,
				}
				this.showRepetitionSelector = true
				return
			}
		}

		// Create mode: select random goal by default
		const allGoals = this.categoriesWithGoals.flatMap( cat =>
			cat.goals.map( g => ( { ...g, category: cat.id } ) )
		)
		const randomIndex = Math.floor( Math.random() * allGoals.length )
		this.selectedGoal = { ...allGoals[randomIndex], id: createUniqueGoalId(), reps: 1 }
	},
	beforeUnmount() {
		// Ensure modal is closed to prevent transition blocking clicks
		this.showModal = false
	},
	methods: {
		isGoalSelected( goal, categoryId ) {
			return this.selectedGoal &&
				this.selectedGoal.name === goal.name &&
				this.selectedGoal.icon === goal.icon &&
				this.selectedGoal.category === categoryId
		},
		isGoalInList( goal, categoryId ) {
			return goals.value.some( g =>
				g.name === goal.name &&
				g.icon === goal.icon &&
				g.category === categoryId
			)
		},
		selectGoal( goal, categoryId ) {
			this.selectedGoal = { ...goal, category: categoryId, id: createUniqueGoalId(), reps: 1 }
		},
		addCustomGoal() {
			if ( this.customGoal.trim() ) {
				this.selectedGoal = {
					id: createUniqueGoalId(),
					icon: '📝',
					name: this.customGoal.trim(),
					reps: 1,
				}
				this.customGoal = ''
			}
		},
		handleContinue() {
			if ( !this.showRepetitionSelector ) {
				// First click: transition to repetition selector
				animateOut( this.$el, () => {
					this.showRepetitionSelector = true
					this.$nextTick( () => {
						animateIn( this.$el )
					} )
				} )
			} else {
				// Second click: save (edit) or open modal (create)
				if ( this.isEditMode ) {
					this.saveEdit()
				} else {
					this.openModal()
				}
			}
		},
		goStep2() {
			if ( this.selectedGoal ) {
				this.step = 2
			}
		},
		incr() {
			if ( this.selectedGoal.reps < 6 ) this.selectedGoal.reps++
		},
		decr() {
			if ( this.selectedGoal.reps > 1 ) this.selectedGoal.reps--
		},
		openModal() {
			this.showModal = true
		},
		async saveEdit() {
			const g = goals.value.find( gg => gg.id === this.editGoalId )
			if ( !g ) {
				this.$router.push( '/' )
				return
			}

			const newReps = Math.max( 1, Math.min( 6, Number( this.current.reps ) || 1 ) )
			g.repetitions = newReps
			// Keep progress valid
			if ( g.progress > g.repetitions ) {
				g.progress = g.repetitions
			}

			await saveAndNotify()
			this.$router.push( '/' )
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
		openAddModal( categoryId ) {
			this.addingToCategoryId = categoryId
			this.newGoalName = ''
			this.newGoalEmoji = '🎯'
			this.showAddModal = true
		},
		closeAddModal() {
			this.showAddModal = false
			this.showEmojiPicker = false
			this.addingToCategoryId = null
			this.newGoalName = ''
			this.newGoalEmoji = ''
		},
		selectEmoji( emoji ) {
			this.newGoalEmoji = emoji
			this.showEmojiPicker = false
		},
		async confirmAddGoal() {
			if ( !this.newGoalName.trim() || !this.addingToCategoryId ) return

			const category = this.categoriesWithGoals.find( c => c.id === this.addingToCategoryId )
			if ( category ) {
				const trimmedName = this.newGoalName.trim()
				const capitalizedName = trimmedName.charAt( 0 ).toUpperCase() + trimmedName.slice( 1 )
				const newGoal = {
					name: capitalizedName,
					icon: this.newGoalEmoji.trim() || '🎯',
				}
				// Add to local list
				category.goals.push( newGoal )

				// Persist custom goal to storage
				await addCustomGoal( this.addingToCategoryId, newGoal )

				// Select it immediately
				this.selectGoal( newGoal, this.addingToCategoryId )
			}

			this.closeAddModal()
		},
		beforeRouteLeave( next ) {
			animateOut( this.$el, next )
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
		height calc(100dvh - var(--sait) - var(--saib))
		display flex
		flex-direction column
		padding-bottom var(--saib)

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
			min-height 40px
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
		-webkit-overflow-scrolling touch
		overscroll-behavior contain
		overflow-x hidden
		padding-right 4px
		padding-bottom 20px
		min-height 0

		&::-webkit-scrollbar
			width 4px

		&::-webkit-scrollbar-track
			background #E2E4F0
			border-radius 2px

		&::-webkit-scrollbar-thumb
			background #7B8AED
			border-radius 2px

			&:hover
				background #3445E1

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
			font-size 14px
			font-weight 600
			color #3445E1
			cursor pointer
			transition all 0.2s
			white-space nowrap

			&.inList
				background #34D399
				color #FFF
				border-color #34D399
				opacity 0.7

			&.selected
				background #3445E1
				color #FFF
				border-color #3445E1
				opacity 1

			&:active
				transform scale(0.95)

			&.addBtn
				width 40px
				min-height 40px
				line-height 1
				display flex
				align-items center
				justify-content center
				font-size 20px
				padding 0
				color #5B6FF5

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
		border-radius 12px
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

	.addModal
		.card
			width 100%
			display flex
			flex-direction column
			align-items center
			box-sizing border-box

		.cardSubtitle
			font-family 'Jost', sans-serif
			font-size 16px
			color rgba(255, 255, 255, 0.8)
			margin-bottom 24px
			text-align center

		.inputGroup
			width 100%
			display flex
			gap 12px
			margin-bottom 32px
			position relative

			.emojiButton
				width 50px
				height 50px
				flex-shrink 0
				display flex
				align-items center
				justify-content center
				font-size 24px
				border 1px solid #E2E4F0
				border-radius 8px
				background #FFF
				cursor pointer
				transition all 0.2s

				&:hover
					border-color #3445E1
					transform scale(1.05)

				&:active
					transform scale(0.95)

			.nameInput
				flex 1
				height 50px
				padding 0 16px
				font-family 'Jost', sans-serif
				font-size 18px
				border 1px solid #E2E4F0
				border-radius 8px
				background #FFF
				color #333

				&:focus
					outline none
					border-color #3445E1

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
			transition all 0.2s

			&:disabled
				opacity 0.5
				cursor not-allowed

			&:not(:disabled):active
				animation btn-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)

@keyframes btn-pop
	0%
		transform scale(1)
	30%
		transform scale(0.92)
	60%
		transform scale(1.05)
	100%
		transform scale(1)
</style>
