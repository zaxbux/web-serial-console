<template>
	<svg
		ref="svg"
		viewBox="0 0 24 24"
		:style="style"
		:role="role"
		:aria-labelledby="ariaLabelledBy"
		>
		<title v-if="title" :id="labelledById">{{ title }}</title>
		<desc v-if="description" :id="describedById">{{ description }}</desc>
		<path :d="path" :style="pathStyle" />
	</svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		title: {
			type: String,
		},
		description: {
			type: String,
		},
		path: {
			type: String,
			required: true,
		},
		size: {
			type: [Number, String],
			default: 1,
		},
		color: {
			type: String,
			default: 'currentColor',
		},
		style: {
			type: Object,
			default: {},
		},
	},
	setup(props) {
		const id = 0;
		const pathStyle = {}

		if (props.size !== null) {
			props.style.width = typeof props.size === 'string'
			? props.size
			: `${props.size * 1.25}rem`
			props.style.height = props.style.width
		}

		if (props.color !== null) {
			pathStyle.fill = props.color;
		}

		let ariaLabelledBy;
		let labelledById = `icon_labelledby_${id}`
		let describedById = `icon_describedby_${id}`
		let role;

		if (props.title) {
			ariaLabelledBy = props.description
			? `${labelledById} ${describedById}`
			: labelledById
		} else {
			role = 'presentation'

			if (props.description) {
				throw new Error('title attribute required when description is set')
			}
		}
		return {
			pathStyle,
			role,
			ariaLabelledBy,
			labelledById,
			describedById,
		}
	},
})
</script>
