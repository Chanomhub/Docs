import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://docs.chanomhub.com',
	integrations: [
		sitemap(),
		starlight({
			title: 'ChanomHub Docs',
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'ไทย',
					lang: 'th',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/chanomhub' },
			],
			sidebar: [
				{
					label: 'เริ่มต้นใช้งาน',
					translations: { en: 'Getting Started' },
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'ChanoX2',
					autogenerate: { directory: 'chanox2' },
				},
				{
					label: 'API Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
