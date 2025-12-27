<template>
	<div class="NotificationToggle" :class="{ isDisabled: isBusy }" @click="openPicker">
		<div class="left">
			<div class="titleRow">
				<div class="title">Reminders</div>
				<div class="separator">·</div>
				<div class="modeInline">{{ modeTitle }}</div>
				<div v-if="statusTag" class="tag" :class="tagClass">{{ statusTag }}</div>
			</div>
			<div class="subtitle">{{ subtitle }}</div>
		</div>

		<div class="right">
			<div class="editLabel">Edit</div>
			<div class="chevron">›</div>
		</div>
	</div>

	<Modal :show="showPicker" @close="closePicker">
		<div class="picker">
			<div class="pickerHeader">
				<div class="pickerTitle">Reminders</div>
				<button class="pickerClose" @click="closePicker">Close</button>
			</div>

			<div class="pickerList">
				<button
					v-for="opt in modeOptions"
					:key="opt.id"
					class="pickerItem"
					:class="{ isSelected: opt.id === mode }"
					:disabled="isBusy"
					@click="selectMode(opt.id)"
				>
					<div class="pickerItemLeft">
						<div class="pickerItemTitle">{{ opt.title }}</div>
						<div class="pickerItemDesc">{{ opt.desc }}</div>
					</div>
					<div v-if="opt.id === mode" class="check">✓</div>
				</button>
			</div>
		</div>
	</Modal>
</template>

<script>
import Modal from '@/components/Modal.vue'
import notificationManager from '@/utils/notifications'
import { REMINDER_MODES } from '@/utils/notifications'

export default {
	name: 'NotificationToggle',
	components: { Modal },
	data() {
		return {
			permission: 'prompt',
			mode: REMINDER_MODES.COMPLETE,
			isBusy: false,
			showPicker: false,
		}
	},
	async mounted() {
		this.permission = notificationManager.permission || 'prompt'
		this.mode = notificationManager.mode || this.mode
		notificationManager.onPermissionChange.add( this.updateStatus )
	},
	beforeUnmount() {
		notificationManager.onPermissionChange.remove( this.updateStatus )
	},
	computed: {
		modeOptions() {
			return [
				{ id: REMINDER_MODES.COMPLETE, title: 'Complete', desc: 'Never miss something' },
				{ id: REMINDER_MODES.DAILY, title: 'Daily', desc: 'One gentle daily check-in' },
				{ id: REMINDER_MODES.BEGINNING_MIDDLE_END, title: 'Beginning · Middle · End', desc: '3 times per week' },
				{ id: REMINDER_MODES.TIME_TO_TIME, title: 'Time to time', desc: 'Occasional nudges' },
				{ id: REMINDER_MODES.NEVER, title: 'Never', desc: 'Off' },
			]
		},
		isDenied() {
			return this.permission === 'denied'
		},
		isOff() {
			return this.mode === REMINDER_MODES.NEVER
		},
		modeTitle() {
			const found = this.modeOptions.find( o => o.id === this.mode )
			return found ? found.title : 'Complete'
		},
		subtitle() {
			if ( this.isBusy ) return 'Updating…'
			if ( !this.isOff && this.isDenied ) return 'Turn on in Settings to receive reminders'

			const found = this.modeOptions.find( o => o.id === this.mode )
			return found ? found.desc : ''
		},
		statusTag() {
			if ( this.isBusy ) return null
			if ( !this.isOff && this.isDenied ) return 'Blocked'
			return null
		},
		tagClass() {
			if ( !this.isOff && this.isDenied ) return 'isBlocked'
			return ''
		},
	},
	methods: {
		updateStatus( payload ) {
			if ( payload && typeof payload === 'object' ) {
				if ( payload.permission ) this.permission = payload.permission
				if ( payload.mode ) this.mode = payload.mode
				return
			}

			// Backward compatibility if something else still dispatches boolean
			this.permission = notificationManager.permission || this.permission
			this.mode = notificationManager.mode || this.mode
		},
		openPicker() {
			if ( this.isBusy ) return
			this.showPicker = true
		},
		closePicker() {
			if ( this.isBusy ) return
			this.showPicker = false
		},
		async selectMode( mode ) {
			this.isBusy = true
			await notificationManager.setMode( mode )
			this.mode = notificationManager.mode || mode
			this.permission = notificationManager.permission || this.permission
			this.isBusy = false
			this.showPicker = false
		},
	},
}
</script>

<style lang="stylus" scoped>
.NotificationToggle
	width 327px
	margin 0 auto
	padding 12px 14px
	background rgba(226, 228, 240, 0.2)
	border 1px solid rgba(138, 144, 199, 0.16)
	border-radius 6px
	display flex
	align-items center
	justify-content space-between
	gap 12px
	cursor pointer
	transition transform 0.2s, background 0.2s

	&:active
		transform scale(0.98)

	&.isDisabled
		opacity 0.8
		cursor default

	.left
		flex 1
		min-width 0

	.titleRow
		display flex
		align-items center
		gap 8px
		margin-bottom 4px

	.title
		font-family 'Jost', sans-serif
		font-size 16px
		font-weight 500
		color #010101

	.separator
		font-family 'Jost', sans-serif
		font-size 16px
		color #A0A0A0

	.modeInline
		font-family 'Jost', sans-serif
		font-size 16px
		font-weight 600
		color #010101

	.subtitle
		font-family 'Jost', sans-serif
		font-size 13px
		line-height 18px
		color #A0A0A0
		white-space nowrap
		overflow hidden
		text-overflow ellipsis

	.tag
		font-family 'Jost', sans-serif
		font-size 12px
		line-height 12px
		padding 5px 8px
		border-radius 999px
		border 1px solid rgba(138, 144, 199, 0.22)
		background rgba(255, 255, 255, 0.7)
		color #6C5CE7

		&.isOff
			color #666

		&.isBlocked
			color #FF5379

.right
	display flex
	align-items center
	gap 8px

	.editLabel
		font-family 'Jost', sans-serif
		font-size 13px
		color #6C5CE7
		white-space nowrap

	.chevron
		font-size 18px
		color rgba(108, 92, 231, 0.55)

.picker
	background #fff
	border-radius 12px
	padding 16px
	min-height 40vh

	.pickerHeader
		display flex
		align-items center
		justify-content space-between
		margin-bottom 12px

	.pickerTitle
		font-family 'Jost', sans-serif
		font-size 18px
		font-weight 500
		color #010101

	.pickerClose
		background transparent
		border none
		font-family 'Jost', sans-serif
		font-size 14px
		color #6C5CE7
		cursor pointer

	.pickerList
		display flex
		flex-direction column
		gap 10px

	.pickerItem
		width 100%
		padding 12px 12px
		background rgba(226, 228, 240, 0.2)
		border 1px solid rgba(138, 144, 199, 0.16)
		border-radius 10px
		cursor pointer
		display flex
		align-items center
		justify-content space-between
		gap 12px
		text-align left

		&.isSelected
			border-color rgba(108, 92, 231, 0.35)

		&:disabled
			opacity 0.7
			cursor default

	.pickerItemTitle
		font-family 'Jost', sans-serif
		font-size 15px
		font-weight 500
		color #010101

	.pickerItemDesc
		margin-top 4px
		font-family 'Jost', sans-serif
		font-size 13px
		line-height 18px
		color #A0A0A0

	.check
		font-size 18px
		color #6C5CE7
</style>
