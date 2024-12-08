/** @type {import('tailwindcss').Config} */
export default {
	important: true,
	content: ['./src/web/**/*.{vue,js,ts,jsx,tsx,html,ejs}'],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['light'],
		logs: false,
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
