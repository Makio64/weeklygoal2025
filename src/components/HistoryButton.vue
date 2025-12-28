<template>
	<button class="HistoryButton" @click="$emit('click')">
		<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="12" r="10" stroke="#8A90C7" stroke-width="1.5" />
			<path d="M12 7V12L15 15" stroke="#8A90C7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<span class="text">View Past Weeks</span>
	</button>
</template>

<script>
export default {
	name: 'HistoryButton',
	emits: ['click'],
}
</script>

<style lang="stylus" scoped>
.HistoryButton
	width 327px
	height 48px
	margin 0 auto
	margin-bottom 12px
	padding 0
	background transparent
	border none
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

	.text
		font-family 'Jost', sans-serif
		font-size 16px
		font-weight 400
		line-height 16px
		color #8A90C7
</style>
