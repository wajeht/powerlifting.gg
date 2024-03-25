/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/views/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['light'],
	},
	plugins: [require('daisyui')],
};
