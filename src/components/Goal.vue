<template>
	<div class="Goal" :class="{ swiped }">
		<div ref="content" class="goalContent">
			<div class="iconName">
				<span class="icon">{{ icon }}</span>
				<span class="name">{{ name }}</span>
			</div>
			<div class="checks">
				<CheckGoal
					v-for="i in repetitions"
					:key="i"
					:done="i <= progress"
					@click.stop="handleCheckClick(i)"
				/>
			</div>
		</div>
		<div class="progressBar">
			<div class="progressFill" :style="{ width: (progress / repetitions * 100) + '%' }" />
		</div>
		<div class="actions">
			<!-- <button class="edit" @click.stop="$emit('edit')">
				<img src="/img/edit.png" alt="edit">
			</button> -->
			<button class="remove" @click.stop="$emit('remove')">
				<img src="/img/bin.png" alt="delete">
			</button>
		</div>
	</div>
</template>

<script>
import { goalSwiped } from '@/store'

import CheckGoal from './CheckGoal.vue'

export default {
	name: 'Goal',
	components: { CheckGoal },
	emits: ['update', 'edit', 'remove'],
	props: {
		id: { type: [Number, String], required: true },
		name: String,
		icon: { type: String, default: '📝' },
		repetitions: { type: Number, default: 5 },
		progress: { type: Number, default: 0 },
	},
	data() {
		return {
			swiped: false,
			startX: 0,
			startY: 0,
			isSwiping: false,
		}
	},
	mounted() {
		this.$el.addEventListener( 'touchstart', this.handleTouchStart, { passive: true } )
		this.$el.addEventListener( 'touchmove', this.handleTouchMove, { passive: false } )
		this.$el.addEventListener( 'touchend', this.handleTouchEnd, { passive: true } )
		document.addEventListener( 'click', this.handleClickOutside )
	},
	beforeUnmount() {
		this.$el.removeEventListener( 'touchstart', this.handleTouchStart )
		this.$el.removeEventListener( 'touchmove', this.handleTouchMove )
		this.$el.removeEventListener( 'touchend', this.handleTouchEnd )
		document.removeEventListener( 'click', this.handleClickOutside )
	},
	methods: {
		handleCheckClick( checkIndex ) {
			if ( this.swiped ) return
			this.$emit( 'update', checkIndex <= this.progress ? checkIndex - 1 : checkIndex )
		},
		handleTouchStart( e ) {
			this.startX = e.touches[0].clientX
			this.startY = e.touches[0].clientY
			this.isSwiping = false
		},
		handleTouchMove( e ) {
			const diffX = this.startX - e.touches[0].clientX
			const diffY = this.startY - e.touches[0].clientY

			// Only trigger swipe if horizontal movement is greater than vertical
			if ( !this.isSwiping && Math.abs( diffY ) > Math.abs( diffX ) ) {
				return
			}

			if ( Math.abs( diffX ) >= 20 ) {
				this.isSwiping = true

				if ( diffX >= 20 ) {
					this.swiped = true
					goalSwiped.dispatch( this.id )
				} else {
					this.swiped = false
				}
			}
		},
		handleTouchEnd() {
			this.isSwiping = false
		},
		handleClickOutside( e ) {
			// Close if clicking outside this goal
			if ( this.swiped && !this.$el.contains( e.target ) ) {
				this.swiped = false
			}
		},
		closeSwipe() {
			this.swiped = false
		},
	},
}
</script>

<style lang="stylus" scoped>
.Goal
	position relative
	display flex
	flex-direction column
	background #F0F1F8
	border 1px solid #F3F3FF
	border-radius 6px
	margin-bottom 8px
	overflow hidden
	user-select none
	cursor pointer
	height 48px
	touch-action pan-y

	.goalContent
		flex 1
		padding 0 16px
		display flex
		justify-content space-between
		align-items center
		transition transform 0.3s
		background #F0F1F8
		z-index 2
		border-radius 6px 6px 0 0
		margin-right -2px

	&.swiped .goalContent,
	&.swiped .progressBar
		transform translateX(-60px)

	.iconName
		display flex
		align-items center
		gap 16px
		flex 1
		min-width 0

		.icon
			font-size 20px
			flex-shrink 0

		.name
			font-family 'Jost', sans-serif
			font-size 16px
			line-height 16px
			color #000
			overflow hidden
			text-overflow ellipsis
			white-space nowrap

	.checks
		display flex
		gap 10px
		flex-shrink 0
		margin-left 8px

	.progressBar
		width 100%
		height 6px
		background #E2E4F0
		border-radius 0 0 6px 6px
		overflow hidden
		transition transform 0.3s
		z-index 1
		margin-right -2px

		.progressFill
			height 100%
			background #5D73E7
			border-radius 6px
			transition width 0.3s

	.actions
		position absolute
		right 0
		top 0
		bottom 0
		display flex
		z-index 0
		border-radius 0 6px 6px 0
		overflow hidden

		button
			width 60px
			border none
			cursor pointer
			transition all 0.2s
			height 100%
			background #FFF
			display flex
			align-items center
			justify-content center

			&:active
				opacity 0.8

			&.edit
				border-right 1px solid #E2E4F0

			&.remove
				border-radius 0 6px 6px 0

			img
				width 12px
				height 12px
</style>
