<template>
	<div class="GoalDone">
		<div class="icon">✅</div>
		<div class="text">{{ count }} goal<span v-if="count !== 1">s</span><br>done!</div>
	</div>
</template>

<script>
export default {
	name: 'GoalDone',
	props: {
		count: { type: Number, default: 4 },
	},
}
</script>

<style lang="stylus" scoped>
.GoalDone
	display flex
	flex-direction column
	align-items center
	justify-content center
	gap 4px
	background white
	border-radius 50%
	width 74px
	height 74px
	box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)

	.icon
		font-size 40px

	.text
		text-align center
		font-family 'Jost', sans-serif
		font-size 14px
		line-height 16px
		color #000
</style>
