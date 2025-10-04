<template>
	<Transition name="modal">
		<div v-if="show" class="Modal" @click="handleBackdropClick">
			<div class="modalContent" @click.stop>
				<slot />
			</div>
		</div>
	</Transition>
</template>

<script>
export default {
	name: 'Modal',
	props: {
		show: { type: Boolean, default: false },
	},
	emits: ['close'],
	methods: {
		handleBackdropClick() {
			this.$emit( 'close' )
		},
	},
}
</script>

<style lang="stylus" scoped>
.Modal
	position fixed
	inset 0
	background rgba(0, 0, 0, 0.5)
	display flex
	align-items center
	justify-content center
	z-index 1000
	padding 20px

	.modalContent
		background #FFFFFF
		border-radius 12px
		width 100%
		max-width 375px
		position relative
		overflow hidden

.modal-enter-active,
.modal-leave-active
	transition opacity 0.3s ease

.modal-enter-from,
.modal-leave-to
	opacity 0

.modal-enter-active .modalContent,
.modal-leave-active .modalContent
	transition transform 0.3s ease

.modal-enter-from .modalContent,
.modal-leave-to .modalContent
	transform scale(0.9)
</style>
