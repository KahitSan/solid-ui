import { mergeConfig } from 'vite';

import type { StorybookConfig } from 'storybook-solidjs-vite';
import { plugin } from 'postcss';

export default <StorybookConfig>{
    framework: 'storybook-solidjs-vite',
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        '@storybook/addon-links',
        {
            name: '@storybook/addon-vitest',
            options: {
                cli: false,
            },
        },
    ],
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
        '../src/**/*.mdx'
    ],
    async viteFinal(config) {
         // Load Tailwind v4 vite plugin ONLY in Storybook
        const { default: tailwindcss } = await import('@tailwindcss/vite');

        
        return mergeConfig(config, {
            plugin: [...(config.plugins ?? []), tailwindcss()],
            // Ensure PostCSS is used
            css: {
                postcss: '../postcss.config.js'
            },
            define: {
                'process.env': {},
            },
        });
    },
    docs: {
        autodocs: true,
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            // 👇 Default prop filter, which excludes props from node_modules
            propFilter: (prop: any) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
};
