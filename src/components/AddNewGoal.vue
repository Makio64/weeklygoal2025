<template>
	<button class="AddNewGoal" @click="$emit('click')">
		<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="12" r="10" stroke="#3445E1" stroke-width="1.5" />
			<path d="M12 8V16M8 12H16" stroke="#3445E1" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		<span class="text">Add new goals</span>
	</button>
</template>

<script>
export default {
	name: 'AddNewGoal',
	emits: ['click'],
}
</script>

<style lang="stylus" scoped>
.AddNewGoal
	width 327px
	height 48px
	margin 0 auto
	padding 0
	background rgba(226, 228, 240, 0.2)
	border 1px solid rgba(138, 144, 199, 0.16)
	// add dashes
	border-style: dashed;
	border-radius 6px
	cursor pointer
	display flex
	align-items center
	justify-content center
	gap 8px
	transition all 0.2s
	position relative

	&:active
		transform scale(0.98)

	.icon
		width 24px
		height 24px
		display block

	.text
		font-family 'Jost', sans-serif
		font-size 16px
		font-weight 400
		line-height 16px
		color #3445E1
		text-align center
</style>
