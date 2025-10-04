<template>
	<button class="FeedbackCTA" @click="$emit('click')">
		<img src="/img/letter.png" alt="feedback" class="icon">
		<span class="text">Leave us your feedback</span>
	</button>
</template>

<script>
export default {
	name: 'FeedbackCTA',
	emits: ['click'],
}
</script>

<style lang="stylus" scoped>
.FeedbackCTA
	width 244px
	height 48px
	margin 0 auto 20px
	padding 14px 16px
	background #3445E1
	color #FFFFFF
	border none
	border-radius 4px
	font-family 'Jost', sans-serif
	font-size 16px
	font-weight 400
	line-height 20px
	cursor pointer
	display flex
	align-items center
	justify-content center
	gap 8px
	transition transform 0.2s
	box-shadow 0px 4px 30px rgba(0, 0, 0, 0.24)

	&:active
		transform scale(0.98)

	.icon
		width 27px
		height 19.8px
		display block
</style>
