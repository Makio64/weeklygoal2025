<template>
	<div class="checkWrap">
		<div class="check">
			<img src="/img/Checkbox.png" alt="checkbox" class="checkbox">
			<img v-if="done" src="/img/Checkmark.png" alt="checked" class="checkmark">
		</div>
	</div>
</template>

<script>
export default {
	name: 'CheckGoal',
	props: {
		done: { type: Boolean, default: false },
	},
}
</script>

<style lang="stylus" scoped>
.checkWrap
	padding 8px
	margin -8px
	cursor pointer
	transition transform 0.15s ease-out
	user-select none
	-webkit-tap-highlight-color transparent

	&:active
		transform scale(0.85)

	.check
		width 21.43px
		height 19.6px
		position relative
		display flex
		align-items center
		justify-content center
		flex-shrink 0
		pointer-events none

		.checkbox
			width 100%
			height 100%
			display block

		.checkmark
			position absolute
			width 50%
			height 50%
			display block
</style>
