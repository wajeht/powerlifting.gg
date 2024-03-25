/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,vue}'],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['light'],
	},
	plugins: [require('daisyui')],
};
