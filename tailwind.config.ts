import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))', // Navy Blue
					foreground: 'hsl(var(--primary-foreground))' // Soft White
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))', // Light Gray
					foreground: 'hsl(var(--secondary-foreground))' // Darker Navy/Gray
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))', // Slightly darker Light Gray
					foreground: 'hsl(var(--muted-foreground))' // Medium Navy/Gray
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))', // Maroon
					foreground: 'hsl(var(--accent-foreground))' // Soft White
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))', // Soft White (or very light gray for depth)
					foreground: 'hsl(var(--card-foreground))' // Dark Navy/Gray
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors (keeping purple for now, can be removed if not used by Chatify)
				purple: {
					light: '#D6BCFA',
					DEFAULT: '#9b87f5',
					dark: '#7E69AB',
					deeper: '#6E59A5',
				},
				connect: {
					light: '#F2FCE2',
					yellow: '#FEF7CD',
					orange: '#FEC6A1',
					purple: '#E5DEFF',
					pink: '#FFDEE2',
				},
        // DSU Specific
        dsu: {
          navy: 'hsl(var(--primary))', // From existing primary
          maroon: 'hsl(var(--accent))', // From existing accent
          'soft-white': 'hsl(var(--background))', // Or a slightly off-white like 0 0% 98%
          'light-gray': 'hsl(var(--secondary))', // From existing secondary
        }
			},
			borderRadius: {
				lg: 'var(--radius)', // e.g., 0.75rem
				md: 'calc(var(--radius) - 2px)', // e.g., 0.5rem
				sm: 'calc(var(--radius) - 4px)' // e.g., 0.375rem
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
