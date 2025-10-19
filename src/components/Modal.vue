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
	background rgba(255, 255, 255, 0.2)
	backdrop-filter blur(10px)
	display flex
	align-items center
	justify-content center
	z-index 1000
	padding 20px

	.modalContent
		border-radius 12px
		width 100%
		max-width 375px
		min-height 70vh
		overflow hidden

.modal-enter-active,
.modal-leave-active
	transition opacity 0.3s

.modal-enter-from,
.modal-leave-to
	opacity 0

.modal-enter-active .modalContent,
.modal-leave-active .modalContent
	transition transform 0.3s

.modal-enter-from .modalContent,
.modal-leave-to .modalContent
	transform scale(0.9)
</style>
