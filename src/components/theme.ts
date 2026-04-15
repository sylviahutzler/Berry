import { createTheme, alpha, PaletteMode, Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        highlighted: true;
    }
}
declare module '@mui/material/styles' {
    interface ColorRange {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    }

    interface PaletteColor extends ColorRange {}

    interface Palette {
        baseShadow: string;
    }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const sage = {
    50: '#f6f7f5',
    100: '#e7ebe4',
    200: '#d3dbcd',
    300: '#bcc8b4',
    400: '#a5b59b',
    500: '#8B9D83', // your main sage
    600: '#7a8c73',
    700: '#667760',
    800: '#505d4c',
    900: '#3a4338',
};

export const pink = {
    50: '#fff5f8',
    100: '#ffe6ee',
    200: '#ffc9d8',
    300: '#ffb7c5', // main cherry blossom
    400: '#ff9fb3',
    500: '#ff7f9a',
    600: '#e76682',
    700: '#cc4d6a',
    800: '#a63a54',
    900: '#7a293e',
};

export const stone = {
    50: '#f9f9f8',
    100: '#f0f0ed',
    200: '#e1e1db',
    300: '#d1d1ca',
    400: '#c1c1b8',
    500: '#A8A8A0', // main stone
    600: '#98988f',
    700: '#83837a',
    800: '#6b6b61',
    900: '#525249',
};

export const peach = {
    50: '#fff7f2',
    100: '#ffeddf',
    200: '#ffddc0',
    300: '#ffcda1',
    400: '#ffbd82',
    500: '#FFD7BA', // main peach
    600: '#f5c5a0',
    700: '#e8ad82',
    800: '#da9564',
    900: '#c87d46',
};

export const lavender = {
    50: '#faf8fd',
    100: '#f3eef9',
    200: '#e7ddf3',
    300: '#dbccee',
    400: '#cfbbe8',
    500: '#D4C5E2', // main lavender
    600: '#c5b0d4',
    700: '#b29bc6',
    800: '#9f86b8',
    900: '#8b70aa',
};