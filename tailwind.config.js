/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // e-DEMOKRACIJA — web tokeni (autoritet: živi e-demokracija.hr)
        navy: {
          DEFAULT: '#173863', // primarna brand boja (naslovi, wordmark, theme)
          mid: '#2e5791', // brandbook plava (gradijenti, sekundarno)
          deep: '#1f3d6b', // hover/pressed
          ink: '#162236', // tijelo teksta (near-black navy)
        },
        orange: {
          DEFAULT: '#f7941d', // jedini akcent — CTA, status, ključni iznosi
          light: '#ffb44d', // gradijent kraj
        },
        muted: '#60708a', // sekundarni tekst
        surface: '#ffffff',
        page: '#edf3f8', // pozadina (hladno svijetlo plava)
        hairline: '#e6ecf3', // tanke linije
        chip: '#f4f7fb',
        chipline: '#dce5ef',
      },
      fontFamily: {
        // ZonaPro Light (tijelo) + SemiBold (naslovi/naglasak). Bez italica.
        sans: ['ZonaPro', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '28px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 30px 80px rgba(23, 56, 99, 0.14)',
        soft: '0 12px 32px rgba(23, 56, 99, 0.10)',
      },
      letterSpacing: {
        eyebrow: '0.16em',
        display: '-0.04em',
      },
      keyframes: {
        pulseDot: {
          '0%': { boxShadow: '0 0 0 0 rgba(247,148,29,0.55)' },
          '70%': { boxShadow: '0 0 0 8px rgba(247,148,29,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(247,148,29,0)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2.2s infinite',
        riseIn: 'riseIn 0.4s ease both',
      },
    },
  },
  plugins: [],
};
