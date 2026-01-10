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
					lang: 'en',
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
					items: [
						{ label: 'คู่มือเริ่มต้น', slug: 'guides/getting-started', translations: { en: 'Getting Started Guide' } },
					],
				},
				{
					label: 'ChanoX2',
					items: [
						{ label: 'เริ่มต้นใช้งาน', slug: 'chanox2/getting-started', translations: { en: 'Getting Started' } },
						{ label: 'การติดตั้ง', slug: 'chanox2/installation', translations: { en: 'Installation' } },
						{ label: 'การตั้งค่า', slug: 'chanox2/configuration', translations: { en: 'Configuration' } },
						{ label: 'แก้ไขปัญหา', slug: 'chanox2/troubleshooting', translations: { en: 'Troubleshooting' } },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'API', slug: 'reference/api' },
					],
				},
			],
		}),
	],
});
