<template>
	<button class="notificationBtn" @click="toggle">
		{{ enabled ? '🔔' : '🔕' }} {{ enabled ? 'Notifications On' : 'Enable Notifications' }}
	</button>
</template>

<script>
import notificationManager from '@/utils/notifications'

export default {
	name: 'NotificationToggle',
	data() {
		return {
			enabled: false,
		}
	},
	async mounted() {
		this.enabled = notificationManager.enabled
		notificationManager.onPermissionChange.add( this.updateStatus )
	},
	beforeUnmount() {
		notificationManager.onPermissionChange.remove( this.updateStatus )
	},
	methods: {
		async toggle() {
			await notificationManager.toggle()
			this.enabled = notificationManager.enabled
		},
		updateStatus() {
			this.enabled = notificationManager.enabled
		},
	},
}
</script>

<style lang="stylus" scoped>
.notificationBtn
	width 100%
	padding 12px
	background #FFF
	border 1px solid #E2E4F0
	border-radius 4px
	font-family 'Jost', sans-serif
	font-size 14px
	color #666
	cursor pointer
	transition all 0.2s

	&:hover
		background #F8F8F8
		border-color #D0D0D0

	&:active
		transform scale(0.98)
</style>
