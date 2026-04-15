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




//May or may not need, came with MUI
export const orange = {
    50: 'hsl(45, 100%, 97%)',
    100: 'hsl(45, 92%, 90%)',
    200: 'hsl(45, 94%, 80%)',
    300: 'hsl(45, 90%, 65%)',
    400: 'hsl(45, 90%, 40%)',
    500: 'hsl(45, 90%, 35%)',
    600: 'hsl(45, 91%, 25%)',
    700: 'hsl(45, 94%, 20%)',
    800: 'hsl(45, 95%, 16%)',
    900: 'hsl(45, 93%, 12%)',
};

export const red = {
    50: 'hsl(0, 100%, 97%)',
    100: 'hsl(0, 92%, 90%)',
    200: 'hsl(0, 94%, 80%)',
    300: 'hsl(0, 90%, 65%)',
    400: 'hsl(0, 90%, 40%)',
    500: 'hsl(0, 90%, 30%)',
    600: 'hsl(0, 91%, 25%)',
    700: 'hsl(0, 94%, 18%)',
    800: 'hsl(0, 95%, 12%)',
    900: 'hsl(0, 93%, 6%)',
};


export const gray = {
    50: 'hsl(220, 35%, 97%)',
    100: 'hsl(220, 30%, 94%)',
    200: 'hsl(220, 20%, 88%)',
    300: 'hsl(220, 20%, 80%)',
    400: 'hsl(220, 20%, 65%)',
    500: 'hsl(220, 20%, 42%)',
    600: 'hsl(220, 20%, 35%)',
    700: 'hsl(220, 20%, 25%)',
    800: 'hsl(220, 30%, 6%)',
    900: 'hsl(220, 35%, 3%)',
};

export const green = {
    50: 'hsl(120, 80%, 98%)',
    100: 'hsl(120, 75%, 94%)',
    200: 'hsl(120, 75%, 87%)',
    300: 'hsl(120, 61%, 77%)',
    400: 'hsl(120, 44%, 53%)',
    500: 'hsl(120, 59%, 30%)',
    600: 'hsl(120, 70%, 25%)',
    700: 'hsl(120, 75%, 16%)',
    800: 'hsl(120, 84%, 10%)',
    900: 'hsl(120, 87%, 6%)',
};

export const brand = {
    50: 'hsl(210, 100%, 95%)',
    100: 'hsl(210, 100%, 92%)',
    200: 'hsl(210, 100%, 80%)',
    300: 'hsl(210, 100%, 65%)',
    400: 'hsl(210, 98%, 48%)',
    500: 'hsl(210, 98%, 42%)',
    600: 'hsl(210, 98%, 55%)',
    700: 'hsl(210, 100%, 35%)',
    800: 'hsl(210, 100%, 16%)',
    900: 'hsl(210, 100%, 21%)',
};


export const getDesignTokens = (mode: PaletteMode) => {
    customShadows[1] =
        mode === 'dark'
            ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
            : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

    return {
        palette: {
            mode,
            primary: {
                light: sage[200],
                main: sage[400],
                dark: sage[700],
                contrastText: sage[50],
                ...(mode === 'dark' && {
                    contrastText: sage[50],
                    light: sage[300],
                    main: sage[400],
                    dark: sage[700],
                }),
            },
            info: {
                light: brand[100],
                main: brand[300],
                dark: brand[600],
                contrastText: gray[50],
                ...(mode === 'dark' && {
                    contrastText: brand[300],
                    light: brand[500],
                    main: brand[700],
                    dark: brand[900],
                }),
            },
            warning: {
                light: orange[300],
                main: orange[400],
                dark: orange[800],
                ...(mode === 'dark' && {
                    light: orange[400],
                    main: orange[500],
                    dark: orange[700],
                }),
            },
            error: {
                light: red[300],
                main: red[400],
                dark: red[800],
                ...(mode === 'dark' && {
                    light: red[400],
                    main: red[500],
                    dark: red[700],
                }),
            },
            success: {
                light: green[300],
                main: green[400],
                dark: green[800],
                ...(mode === 'dark' && {
                    light: green[400],
                    main: green[500],
                    dark: green[700],
                }),
            },
            grey: {
                ...gray,
            },
            divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
            background: {
                default: 'hsl(0, 0%, 99%)',
                paper: 'hsl(220, 35%, 97%)',
                ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
                ...(mode === 'dark' && { primary: 'hsl(0, 0%, 100%)', secondary: gray[400] }),
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
                ...(mode === 'dark' && {
                    hover: alpha(gray[600], 0.2),
                    selected: alpha(gray[600], 0.3),
                }),
            },
        },
        typography: {
            fontFamily: 'Inter, sans-serif',
            h1: {
                fontSize: defaultTheme.typography.pxToRem(48),
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: -0.5,
            },
            h2: {
                fontSize: defaultTheme.typography.pxToRem(36),
                fontWeight: 600,
                lineHeight: 1.2,
            },
            h3: {
                fontSize: defaultTheme.typography.pxToRem(30),
                lineHeight: 1.2,
            },
            h4: {
                fontSize: defaultTheme.typography.pxToRem(24),
                fontWeight: 600,
                lineHeight: 1.5,
            },
            h5: {
                fontSize: defaultTheme.typography.pxToRem(20),
                fontWeight: 600,
            },
            h6: {
                fontSize: defaultTheme.typography.pxToRem(18),
                fontWeight: 600,
            },
            subtitle1: {
                fontSize: defaultTheme.typography.pxToRem(18),
            },
            subtitle2: {
                fontSize: defaultTheme.typography.pxToRem(14),
                fontWeight: 500,
            },
            body1: {
                fontSize: defaultTheme.typography.pxToRem(14),
            },
            body2: {
                fontSize: defaultTheme.typography.pxToRem(14),
                fontWeight: 400,
            },
            caption: {
                fontSize: defaultTheme.typography.pxToRem(12),
                fontWeight: 400,
            },
        },
        shape: {
            borderRadius: 8,
        },
        shadows: customShadows,
    };
};

export const colorSchemes = {
    light: {
        palette: {
            primary: {
                light: green[300],
                main: green[400],
                dark: green[700],
                contrastText: '#ffffff',
            },
            secondary: {
                light: pink[200],
                main: pink[300], // cherry blossom
                dark: pink[600],
                contrastText: '#ffffff',
             },
            accent1: {
                light: peach[200],
                main: peach[300], // cherry blossom
                dark: peach[600],
                contrastText: '#ffffff',
            },
            accent2: {
                light: lavender[200],
                main: lavender[300], // cherry blossom
                dark: lavender[600],
                contrastText: '#ffffff',
            },
            info: {
                light: brand[100],
                main: brand[300],
                dark: brand[600],
                contrastText: gray[50],
            },
            warning: {
                light: orange[300],
                main: orange[400],
                dark: orange[800],
            },
            error: {
                light: red[300],
                main: red[400],
                dark: red[800],
            },
            success: {
                light: green[300],
                main: green[400],
                dark: green[800],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[300], 0.4),
            background: {
                default: '#ffffff',
                paper: '#ffffff',
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
            },
            baseShadow:
                'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
        },

    },
};

export const typography = {
    fontFamily: 'Inter, sans-serif',
    h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
    },
    h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
    },
    h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
    },
    h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
    },
    h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
    },
    subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
    },
    subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
    },
    body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
    },
    body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
    },
    caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
    },
};

export const shape = {
    borderRadius: 8,
};

// @ts-ignore
const defaultShadows: Shadows = [
    'none',
    'var(--template-palette-baseShadow)',
    ...defaultTheme.shadows.slice(2),
];;
export const shadows = defaultShadows;

const theme = createTheme({
    palette: colorSchemes.light.palette,
    typography,
    shape,
    shadows,
});

export default theme;
