import { createTheme, alpha, PaletteMode, Shadows, PaletteOptions } from '@mui/material/styles';

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

    interface PaletteOptions {
        baseShadow?: string;
    }
}

// Color Palettes
export const forestGreen = {
    50: '#f2f7f4',
    100: '#dceee7',
    200: '#c5e5da',
    300: '#aedccd',
    400: '#97d3bf',
    500: '#2f6f4e', // main forest green
    600: '#2a6347',
    700: '#245740',
    800: '#1f4b39',
    900: '#193f32',
};

export const mintGreen = {
    50: '#f5faf8',
    100: '#dceef2',
    200: '#c3e7ec',
    300: '#aae0e6',
    400: '#91d9e0',
    500: '#dcefe3', // main mint green
    600: '#c2e5d7',
    700: '#a8dccb',
    800: '#8ed3bf',
    900: '#74cab3',
};

export const gold = {
    50: '#fefcf4',
    100: '#fbf3de',
    200: '#f8eac8',
    300: '#f5e1b2',
    400: '#f2d89c',
    500: '#e1b12c', // main gold
    600: '#d3a027',
    700: '#c58f22',
    800: '#b77e1d',
    900: '#a96d18',
};

export const coral = {
    50: '#faf6f4',
    100: '#f0dcd7',
    200: '#e6c2ba',
    300: '#dca89d',
    400: '#d28e80',
    500: '#c94a3a', // main coral
    600: '#b84235',
    700: '#a73a30',
    800: '#96322b',
    900: '#852a26',
};

export const slate = {
    50: '#f7f9fa',
    100: '#e7eef3',
    200: '#d7e3ec',
    300: '#c7d8e5',
    400: '#b7cdde',
    500: '#4e6e81', // main slate
    600: '#466479',
    700: '#3e5a71',
    800: '#365069',
    900: '#2e4661',
};

// Neutral grays
export const gray = {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
};

export const cream = {
    500:'#faf3dd',

};

const defaultTheme = createTheme();

const customShadows: Shadows = [
    'none',
    '0 1px 2px 0 rgba(31, 75, 57, 0.05)',
    '0 1px 3px 0 rgba(31, 75, 57, 0.1), 0 1px 2px 0 rgba(31, 75, 57, 0.06)',
    '0 4px 6px -1px rgba(31, 75, 57, 0.1), 0 2px 4px -1px rgba(31, 75, 57, 0.06)',
    '0 10px 15px -3px rgba(31, 75, 57, 0.1), 0 4px 6px -2px rgba(31, 75, 57, 0.05)',
    '0 20px 25px -5px rgba(31, 75, 57, 0.1), 0 10px 10px -5px rgba(31, 75, 57, 0.04)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
    '0 25px 50px -12px rgba(31, 75, 57, 0.15)',
];

const lightPalette: PaletteOptions = {
    mode: 'light',
    primary: {
        ...forestGreen,
        main: forestGreen[500],
    },
    secondary: {
        ...slate,
        main: slate[500],
    },
    error: {
        ...coral,
        main: coral[500],
    },
    warning: {
        ...gold,
        main: gold[500],
    },
    info: {
        ...mintGreen,
        main: mintGreen[500],
    },
    success: {
        ...forestGreen,
        main: forestGreen[500],
    },
    background: {
        default: gray[50],
        paper: '#ffffff',
    },
    text: {
        primary: gray[900],
        secondary: gray[600],
        disabled: gray[400],
    },
    divider: gray[200],
    baseShadow: 'rgba(31, 75, 57, 0.12)',
};

const darkPalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        ...forestGreen,
        main: forestGreen[500],
    },
    secondary: {
        ...slate,
        main: slate[500],
    },
    error: {
        ...coral,
        main: coral[500],
    },
    warning: {
        ...gold,
        main: gold[500],
    },
    info: {
        ...mintGreen,
        main: mintGreen[500],
    },
    success: {
        ...forestGreen,
        main: forestGreen[500],
    },
    background: {
        default: gray[900],
        paper: gray[800],
    },
    text: {
        primary: gray[50],
        secondary: gray[300],
        disabled: gray[500],
    },
    divider: gray[700],
    baseShadow: 'rgba(0, 0, 0, 0.32)',
};

export const lightTheme = createTheme({
    palette: lightPalette,
    shadows: customShadows,
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.57,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '10px 20px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
                contained: {
                    boxShadow: `0 4px 6px -1px ${alpha(forestGreen[500], 0.1)}`,
                },
                containedPrimary: {
                    backgroundColor: forestGreen[500],
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: forestGreen[600],
                        boxShadow: `0 10px 15px -3px ${alpha(forestGreen[500], 0.2)}`,
                    },
                },
                containedSecondary: {
                    backgroundColor: slate[500],
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: slate[600],
                        boxShadow: `0 10px 15px -3px ${alpha(slate[500], 0.2)}`,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    border: `1px solid ${gray[200]}`,
                    boxShadow: `0 1px 3px 0 ${alpha(forestGreen[500], 0.1)}`,
                },
            },
        },
        MuiPaper: {
            variants: [
                {
                    props: { variant: 'highlighted' },
                    style: {
                        backgroundColor: alpha(forestGreen[50], 0.5),
                        border: `1px solid ${forestGreen[200]}`,
                    },
                },
            ],
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: '12px',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 500,
                },
                filledPrimary: {
                    backgroundColor: alpha(forestGreen[500], 0.1),
                    color: forestGreen[700],
                },
                filledSuccess: {
                    backgroundColor: alpha(forestGreen[500], 0.1),
                    color: forestGreen[700],
                },
                filledWarning: {
                    backgroundColor: alpha(gold[500], 0.1),
                    color: gold[700],
                },
                filledError: {
                    backgroundColor: alpha(coral[500], 0.1),
                    color: coral[700],
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                            borderColor: forestGreen[300],
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: forestGreen[500],
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: gray[900],
                    boxShadow: `0 1px 3px 0 ${alpha(forestGreen[500], 0.1)}`,
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: forestGreen[600],
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                        color: forestGreen[700],
                        textDecoration: 'underline',
                    },
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: darkPalette,
    shadows: customShadows,
    typography: lightTheme.typography,
    components: lightTheme.components,
});

export default lightTheme;