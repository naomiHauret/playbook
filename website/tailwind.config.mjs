import {
	mint,
	gray
  } from '@radix-ui/colors';

  
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				neutral: {
					1: gray.gray1,
					2: gray.gray2,
					3: gray.gray3,
					4: gray.gray4,
					5: gray.gray5,
					6: gray.gray6,
					7: gray.gray7,
					8: gray.gray8,
					9: gray.gray9,
					10: gray.gray10,
					11: gray.gray11,
					12: gray.gray12,
				},
				accent: {
					1: mint.mint1,
					2: mint.mint2,
					3: mint.mint3,
					4: mint.mint4,
					5: mint.mint5,
					6: mint.mint6,
					7: mint.mint7,
					8: mint.mint8,
					9: mint.mint9,
					10: mint.mint10,
					11: mint.mint11,
					12: mint.mint12,
				},
			},
			fontFamily: {
				'sans': ["Inter", "sans-serif"],
				'serif': ["Tino", 'serif'],
			}
		},
	},
	plugins: [],
}
