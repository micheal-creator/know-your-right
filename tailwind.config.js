/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Official-document palette: black ink on warm off-white paper,
        // with a single restrained deep-green accent.
        paper: '#FBFBF9',
        card: '#FFFFFF',
        ink: '#141414',
        muted: '#5B5F5A',
        faint: '#8A8F89',
        line: '#E6E5DF',
        accent: {
          DEFAULT: '#0F5132',
          hover: '#0B4026',
          soft: '#E7F0EA',
        },
        warn: '#8A5A00',
        warnsoft: '#FBF1DC',
        // Redesign tokens
        forest: { DEFAULT: '#0F5132', deep: '#0B4026' },
        flame: { DEFAULT: '#E4622E', hover: '#CE521F', soft: '#FBE7DC' },
        danger: { DEFAULT: '#D61F20', hover: '#B81719' },
        sage: '#5E7468',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Lora', 'Georgia', 'serif'],
        heading: ['Lora', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        content: '640px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,20,20,0.05), 0 1px 3px rgba(20,20,20,0.04)',
        lift: '0 6px 20px rgba(20,20,20,0.10)',
        fab: '0 8px 22px rgba(20,20,20,0.18)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.5rem',
      },
    },
  },
  plugins: [],
}
