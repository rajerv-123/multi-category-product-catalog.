
This approach delivers a visually striking, fast, and functional product catalog with modern UX patterns—all without heavy dependencies

 Tools & Technologies Used
Category	Technology
Framework	Next.js 16 (React)
Styling	CSS Modules + Custom CSS Variables
Language	JavaScript (React Hooks)
Data	Local JSON data array
Storage	Browser localStorage (favorites, cart, dark mode)

 Idea & Approach
Minimalist Cleanup First
Removed unused folders (src/, styles/, hooks/, components/) that were leftover from project scaffolding. This reduced confusion and improved maintainability.

Dark Theme with Animated Background
Instead of a plain white background, I created a deep space-themed design with:

Floating gradient orbs that animate continuously
Pulsing glow effects in the header
Glassmorphism cards with backdrop blur
Progressive Enhancement

Cards have hover effects (lift + glow)
Detail view includes action buttons
Cart sidebar slides in smoothly
Floating action buttons for quick access
User Experience Focus

localStorage persists favorites & cart across sessions
Floating buttons show real-time counts
Compare feature allows side-by-side product specs
Responsive design works on mobile
Performance

No external UI libraries (lightweight)
CSS-only animations (no JS animation libraries)
Static data filtering (fast)


├── app/
│   ├── page.jsx       # Main catalog component
│   ├── styles.module.css  # Creative styling
│   └── globals.css    # Base styles
├── data.js            # Product data
├── public/            # Static assets
└── package.json       # Dependencies