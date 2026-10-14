# Lumen Estates

A luxury real estate web experience featuring dynamic animations, 3D interactive coverflow, mortgage calculators, and curated property showcases.

## Features

- **Hero & Topographic Canvas**: Procedural noise animation and skyline line art.
- **Featured Residences**: Interactive property cards with specs, pricing, and high-resolution photo galleries.
- **3D Coverflow Carousel**: Interactive interior viewer with keyboard and touch/drag support.
- **Mortgage & Budget Planner**: Real-time loan, deposit, interest, and monthly payment calculator.
- **Interactive Lightbox**: Fullscreen photo previewer.
- **Responsive & Accessible**: Optimized for all devices and respects `prefers-reduced-motion`.

## Structure

```
├── index.html        # Main HTML structure
├── css/
│   └── styles.css    # Design system, layout, and components
├── js/
│   └── main.js       # Core interactivity and canvas graphics
├── images/           # High-resolution property assets
└── package.json      # Project metadata & npm dev server scripts
```

## Getting Started

To run locally:

```bash
# Using Python
python -m http.server 3000

# Or using npm
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.
