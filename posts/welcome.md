---
title: Getting Started with Pip-UI
date: 2026-01-17
description: A complete guide to building your first landing page with the pip-ui retro framework.
---

# Getting Started with Pip-UI

Welcome! If you're looking to create a web interface with a distinct **retro-futuristic** or **terminal** aesthetic, `pip-ui` is the tool for you. heavily inspired by the Fallout series interface, it provides a set of consistent styles and components to turn any standard HTML page into a Pip-Boy 3000 interface.

In this guide, I'll walk you through how to install `pip-ui` and build a complete landing page.

## Installation

The first step is getting the localized CSS files into your project. Since `pip-ui` is designed to be lightweight and dependency-free, you don't need `npm` or complex build tools.

### 1. Clone or Download
You can download the latest release from the [GitHub Repository](https://github.com/mappyx/pip-ui) or clone it directly:

```bash
git clone https://github.com/mappyx/pip-ui.git
```

### 2. Project Structure
Once downloaded, move the `css` folder into your project root. Your directory should look like this:

```text
my-project/
├── index.html
└── css/
    ├── pipboy.css
    └── custom.css (optional for your overrides)
```

### 3. Linking the CSS
In your `index.html`, link the `pipboy.css` file. I also recommend adding the **Roboto Mono** font to complete the terminal look.

```html
<head>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- Pip-UI Framework -->
    <link rel="stylesheet" href="css/pipboy.css">
</head>
```

## Creating Your First Landing Page

Now let's build a simple landing page. The magic starts with the `<body>` class.

### 1. The Base Container
Apply `pip-body` for the green terminal styling and `pip-crt` to add the scanline effects.

```html
<body class="pip-body pip-crt">
    <div class="pip-container">
        <!-- Content goes here -->
    </div>
</body>
```

### 2. The Navigation Bar
`pip-ui` comes with a retro navbar built-in.

```html
<nav class="main-nav">
    <div class="nav-container">
        <div class="nav-logo">VAULT.TEC</div>
        <ul class="nav-links">
            <li><a href="#home">STATUS</a></li>
            <li><a href="#data">DATA</a></li>
            <li><a href="#map">MAP</a></li>
        </ul>
    </div>
</nav>
```

### 3. Using the Grid System
The framework includes a responsive grid system similar to Bootstrap but with that signature green glow.

```html
<div class="pip-row">
    <!-- Full width column on mobile, half on desktop -->
    <div class="pip-col-12 pip-col-md-6">
        <section class="pip-panel">
            <div class="pip-panel-header">SYSTEM STATUS</div>
            <p class="pip-text">
                All systems nominal. Nuclear generator operating at 98% efficiency.
            </p>
            <button class="pip-btn primary">RUN DIAGNOSTIC</button>
        </section>
    </div>

    <div class="pip-col-12 pip-col-md-6">
        <section class="pip-panel">
            <div class="pip-panel-header">NOTIFICATIONS</div>
            <ul class="skill-list">
                <li>Water Chip Malfunction</li>
                <li>Radar Detects Movement</li>
                <li>New Vault Dweller Added</li>
            </ul>
        </section>
    </div>
</div>
```

## Best Practices

When working with `pip-ui`, keep these tips in mind to maintain the authentic feel:

1.  **Stick to the Palette**: The framework relies heavily on distinct shades of green (`#0f0`, etc). Avoid introducing too many random colors unless they complement the CRT aesthetic (like amber or alert red).
2.  **Use Panels**: Wrap your content in `.pip-panel` elements. They provide the borders and spacing that define the "module" look of the interface.
3.  **Typography Matters**: Always use monospace fonts like Roboto Mono or VT323. The `pip-body` class sets this globally, but ensure you don't override it with sans-serif fonts in your specific elements.
4.  **CRT Effect**: The `.pip-crt` class adds a subtle scanline overlay and flicker. It's cool, but if you have very detailed images, you might want to toggle it off or adjust opacity in your custom CSS.

## Conclusion

You now have a fully functional retro-terminal landing page! Experiment with different layouts and check out the `examples` folder in the repository for more complex components like forms and data tables.

Happy coding, Dweller!

