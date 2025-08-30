import type { Preview } from 'storybook-solidjs-vite';
import { themes } from 'storybook/theming';
import '../src/styles/globals.css';

const preview: Preview = {
    tags: ['autodocs'],
    parameters: {
        actions: { argTypesRegex: '^on.*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        docs: {
            codePanel: true,
            theme: themes.dark,
        },
        // how the grid looks
        backgrounds: {
            grid: {
                cellSize: 20,
                opacity: 0.5,
                cellAmount: 5,
                // offset defaults are fine; include only if you want to override
                // offsetX: 0,
                // offsetY: 0,
            },
        },
    },

    initialGlobals: {
        backgrounds: { grid: true },
    },
};

export default preview;
