<template>
	<div class="DevelopmentTip cta">
		<div class="ctaTitle">{{ title }}</div>
		<div class="ctaText">{{ text }}</div>
	</div>
</template>

<script>
export default {
	name: 'DevelopmentTip',
	props: {
		title: { type: String, default: 'More about self-development' },
		text: { type: String, default: 'Keep it easy ! Dont be too harsh on yourself, focus on fews litte tasks and transform them to habits in the next week!' },
	},
}
</script>

<style lang="stylus" scoped>
.DevelopmentTip
	.ctaTitle
		font-family 'Jost', sans-serif
		font-size 20px
		color #000
		margin-bottom 8px
		text-align center

	.ctaText
		font-family 'Jost', sans-serif
		font-size 16px
		line-height 20px
		color #FFF
		text-align center
		padding 20px 16px
		border-radius 6px
		border 1px solid #F3F3FF
		background linear-gradient(222deg, #69E0BC 3.32%, #65D6DD 101.77%)
</style>
