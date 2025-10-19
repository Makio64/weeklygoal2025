<template>
	<div class="DailyStrike">
		<div class="icon">🔥</div>
		<div class="text">{{ days }} day<span v-if="days !== 1">s</span><br>strike!</div>
	</div>
</template>

<script>
export default {
	name: 'DailyStrike',
	props: {
		days: { type: Number, default: 3 },
	},
}
</script>

<style lang="stylus" scoped>
.DailyStrike
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
