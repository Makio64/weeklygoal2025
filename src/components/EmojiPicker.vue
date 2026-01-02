<template>
	<div class="EmojiPicker">
		<div class="backdrop" @click="$emit('close')" />
		<div class="pickerContent">
			<div class="categories">
				<button
					v-for="cat in categories"
					:key="cat.id"
					class="catBtn"
					:class="{ active: activeCategory === cat.id }"
					@click="activeCategory = cat.id"
				>
					{{ cat.icon }}
				</button>
			</div>
			<div class="emojiGrid">
				<button
					v-for="emoji in currentEmojis"
					:key="emoji"
					class="emojiBtn"
					@click="selectEmoji(emoji)"
				>
					{{ emoji }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
const emojiData = {
	activity: ['🏃', '🚴', '🏊', '🧘', '🏋️', '⚽', '🏀', '🎾', '🏓', '⛳', '🎯', '🎳', '🧗', '🤸', '🏄', '⛷️', '🛹', '🎿', '🏂', '🏌️', '🤾', '🏇', '🧵', '🎨', '🎭', '🎪', '🎤', '🎸', '🎹', '🎺', '🥁', '🎮', '🎲', '♟️', '🧩', '🎰'],
	health: ['💪', '🧠', '❤️', '🩺', '💊', '🩹', '🧬', '🦷', '👁️', '🫀', '🫁', '😴', '🛌', '🧘', '🏥', '⚕️', '🩻', '💉', '🩸', '🧪'],
	food: ['🥗', '🥦', '🥕', '🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🫐', '🥑', '🥒', '🌽', '🍅', '🥬', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🍆', '🧄', '🧅', '🥔', '🍳', '🥚', '🥛', '☕', '🍵', '🧃', '💧', '🫖'],
	nature: ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌾', '🌻', '🌺', '🌸', '🌼', '🌷', '💐', '🪴', '🍃', '🍂', '🍁', '🌈', '☀️', '🌤️', '⛅', '🌊', '🏔️', '⛰️', '🏕️', '🌅', '🌄'],
	objects: ['📚', '📖', '📝', '✏️', '🖊️', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '📷', '🎥', '🔬', '🔭', '🧭', '⏰', '⌚', '📅', '🗓️', '💼', '🎒', '👓', '🧳', '🔑', '🏠', '🏢', '💰', '💵', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️'],
	symbols: ['✅', '❌', '⭐', '🌟', '💫', '✨', '⚡', '🔥', '💯', '💢', '💥', '💦', '💨', '🕐', '🔔', '📌', '📍', '🎈', '🎉', '🎊', '💝', '💖', '💗', '💓', '💞', '💕', '❤️‍🔥', '🤍', '🖤', '💜', '💙', '💚', '💛', '🧡', '❣️', '♻️', '🔄', '➡️', '⬆️', '🔝', '🆕', '🆙', '🔜'],
}

export default {
	name: 'EmojiPicker',
	emits: ['select', 'close'],
	data() {
		return {
			activeCategory: 'activity',
			categories: [
				{ id: 'activity', icon: '🏃' },
				{ id: 'health', icon: '💪' },
				{ id: 'food', icon: '🥗' },
				{ id: 'nature', icon: '🌱' },
				{ id: 'objects', icon: '📚' },
				{ id: 'symbols', icon: '⭐' },
			],
		}
	},
	computed: {
		currentEmojis() {
			return emojiData[this.activeCategory] || []
		},
	},
	methods: {
		selectEmoji( emoji ) {
			this.$emit( 'select', emoji )
			this.$emit( 'close' )
		},
	},
}
</script>

<style lang="stylus" scoped>
.EmojiPicker
	position absolute
	top 100%
	left 0
	right 0
	z-index 10
	padding-top 8px

.backdrop
	position fixed
	inset 0
	z-index -1

.pickerContent
	background #FFF
	border-radius 16px
	padding 12px
	box-shadow 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)
	border 1px solid rgba(0, 0, 0, 0.05)
	animation pop-in 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)

	// Little arrow pointing up
	&::before
		content ''
		position absolute
		top 0
		left 20px
		width 12px
		height 12px
		background #FFF
		border-left 1px solid rgba(0, 0, 0, 0.05)
		border-top 1px solid rgba(0, 0, 0, 0.05)
		transform rotate(45deg)

.categories
	display flex
	gap 4px
	margin-bottom 12px
	padding-bottom 10px
	border-bottom 1px solid #F0F0F0

	.catBtn
		flex 1
		padding 6px
		background #F5F5F5
		border none
		border-radius 8px
		font-size 18px
		cursor pointer
		transition all 0.2s

		&.active
			background linear-gradient(261deg, #FFBF84 16.31%, #FFB9A3 76.83%)
			transform scale(1.05)
			box-shadow 0 2px 8px rgba(255, 191, 132, 0.4)

		&:active
			transform scale(0.95)

.emojiGrid
	display grid
	grid-template-columns repeat(6, 1fr)
	gap 6px
	max-height 200px
	overflow-y auto
	-webkit-overflow-scrolling touch
	padding-right 4px

	&::-webkit-scrollbar
		width 3px

	&::-webkit-scrollbar-track
		background #F0F0F0
		border-radius 2px

	&::-webkit-scrollbar-thumb
		background #CCC
		border-radius 2px

.emojiBtn
	aspect-ratio 1
	display flex
	align-items center
	justify-content center
	background transparent
	border none
	border-radius 8px
	font-size 22px
	cursor pointer
	transition all 0.15s

	&:hover
		background #F5F5F5
		transform scale(1.15)

	&:active
		transform scale(0.9)
		background linear-gradient(261deg, #FFBF84 16.31%, #FFB9A3 76.83%)

@keyframes pop-in
	0%
		opacity 0
		transform scale(0.8) translateY(-10px)
	100%
		opacity 1
		transform scale(1) translateY(0)
</style>
