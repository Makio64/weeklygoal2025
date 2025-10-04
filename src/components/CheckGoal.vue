<template>
	<div class="check">
		<img src="/img/Checkbox.png" alt="checkbox" class="checkbox">
		<img v-if="done" src="/img/Checkmark.png" alt="checked" class="checkmark">
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
.check
	width 21.43px
	height 19.6px
	position relative
	display flex
	align-items center
	justify-content center
	flex-shrink 0
	cursor pointer
	transition transform 0.1s

	&:active
		transform scale(0.9)

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
