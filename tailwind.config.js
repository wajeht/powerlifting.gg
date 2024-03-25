/** @type {import('tailwindcss').Config} */
export default {
	important: true,
	content: ['./src/views/**/*.{vue,js,ts,jsx,tsx,html}'],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['light'],
	},
	plugins: [require('daisyui')],
};
