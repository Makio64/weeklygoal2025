<template>
	<button class="NewGoalButton" @click="$emit('click')">
		<span class="icon">➕</span>
		<span class="text">Add new goals</span>
	</button>
</template>

<script>
export default {
	name: 'NewGoalButton',
	emits: ['click'],
}
</script>

<style lang="stylus" scoped>
.NewGoalButton
	width 100%
	padding 16px
	background white
	color #5B5FFF
	border 2px dashed #5B5FFF
	border-radius 8px
	font-size 16px
	font-weight 600
	cursor pointer
	display flex
	align-items center
	justify-content center
	gap 8px
	transition all 0.2s

	&:hover
		background #F5F5FF

	&:active
		transform scale(0.98)

	.icon
		font-size 20px
</style>
