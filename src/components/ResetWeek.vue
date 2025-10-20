<template>
	<button class="ResetWeek" @click="handleClick">
		<span class="text">Start new week!</span>
	</button>
</template>

<script>
export default {
	name: 'ResetWeek',
	emits: ['click'],
	methods: {
		handleClick() {
			if ( confirm( 'Are you sure you want to reset all goals to 0? This will start a fresh week.' ) ) {
				this.$emit( 'click' )
			}
		},
	},
}
</script>

<style lang="stylus" scoped>
.ResetWeek
	width 100%
	height 56px
	padding 16px
	background #FFF
	border 2px dashed #E2E4F0
	border-radius 6px
	display flex
	align-items center
	justify-content center
	gap 12px
	cursor pointer
	transition all 0.2s
	font-family 'Nunito', sans-serif
	font-size 16px
	font-weight 600
	color #FF6B6B
	margin-bottom 16px

	&:hover
		background #FFF5F5
		border-color #FF6B6B

	&:active
		transform scale(0.98)

	.icon
		font-size 20px

	.text
		font-size 16px
</style>
