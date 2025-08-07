// Theme configuration (src/theme.ts)
export const colors = {
    primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Main brand blue
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    },
    secondary: {
        500: '#f59e0b', // Vibrant orange
        // ...gradients
    },
    cultural: {
        500: '#dc2626', // Rich red inspired by Eswatini flag
    }
}

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
}

export const textStyles = {
    heading: {
        fontSize: ['2xl', '3xl', '4xl'],
        fontWeight: 'bold',
        lineHeight: 'tight'
    },
    // More text styles...
}