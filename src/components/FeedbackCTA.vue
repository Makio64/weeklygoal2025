<template>
	<button class="FeedbackCTA" @click="openFeedback">
		<img src="/img/letter.png" alt="feedback" class="icon">
		<span class="text">Leave us your feedback</span>
	</button>
</template>

<script>
export default {
	name: 'FeedbackCTA',
	methods: {
		openFeedback() {
			const subject = encodeURIComponent( 'Weekly Goal - Feedback' )
			const body = encodeURIComponent( 'Hi,\n\nMy feedback about the Weekly Goal app:\n\n' )
			const mailtoLink = `mailto:davronai@gmail.com?subject=${subject}&body=${body}`

			// Create a temporary link element and click it (works better on iOS)
			const link = document.createElement( 'a' )
			link.href = mailtoLink
			link.target = '_blank'
			document.body.appendChild( link )
			link.click()
			document.body.removeChild( link )
		},
	},
}
</script>

<style lang="stylus" scoped>
.FeedbackCTA
	width 244px
	height 48px
	margin 0 auto 20px
	padding 14px 16px
	background #3445E1
	color #FFF
	border none
	border-radius 4px
	font-family 'Jost', sans-serif
	font-size 16px
	line-height 20px
	cursor pointer
	display flex
	align-items center
	justify-content center
	gap 8px
	transition transform 0.2s
	box-shadow 0 4px 30px rgba(0, 0, 0, 0.24)

	&:active
		transform scale(0.98)

	.icon
		width 27px
		height 19.8px
</style>
