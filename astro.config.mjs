// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import lunaria from '@lunariajs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.chanomhub.com',
	integrations: [
		starlight({
			title: 'ChanomHub Docs',
			favicon: '/favicon.png',
			// Lunaria translation tracking plugin
			plugins: [lunaria()],
			// Custom components to prevent caching
			components: {
				Head: './src/components/Head.astro',
			},
			// Configure i18n
			locales: {
				// Thai as root/default locale
				root: {
					label: 'ภาษาไทย',
					lang: 'th',
				},
				// English as alternate locale
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			defaultLocale: 'root',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/chanomhub' },
			],
			sidebar: [
				{
					label: 'คู่มือ',
					translations: { en: 'Guides' },
					items: [
						{
							label: 'เริ่มต้นใช้งาน',
							translations: { en: 'Getting Started' },
							slug: 'guides/getting-started'
						},
					],
				},
				{
					label: 'อ้างอิง',
					translations: { en: 'Reference' },
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
