# 🔥 Ember & Oak — Wood-Fired Kitchen & Bar

> **A Front-End Web Development Project**
> *Crafting a digital experience that feels as warm and rustic as the restaurant itself.*

---

## � Introduction

Welcome to **Ember & Oak**. This isn't just a coding project; it's an attempt to capture the feeling of a high-end, rustic dining experience in a web browser.

The goal was simple: build a landing page for a fictional wood-fired restaurant that feels **alive**. I wanted users to smell the smoke and feel the warmth of the hearth the moment the page loads. It needed to be elegant, fast, and built without the crutch of heavy frameworks—just pure, handcrafted HTML, CSS, and JavaScript.

---

## 🎨 The Design Philosophy

I approached this design with a "fire-first" mentality. Every color, font choice, and animation was picked to evoke the feeling of a dimly lit, buzzing restaurant.

-   **The Palette:** Deep charcoals and rich browns form the "wood" foundation, while vibrant ambers and oranges provide the "fire" that guides the user's eye.
-   **Typography:** I paired *Playfair Display* for that classic, editorial menu feel with *Lato* for clean, readable body text.
-   **Motion:** The floating ember particles in the hero section aren't just for show—they set the mood immediately. The smooth fade-ins on scroll mimic the slow, deliberate pace of fine dining.

---

## �️ How It's Built

I believe in mastering the basics. This project is built on the foundational pillars of the web, with a little help from Bootstrap for layout efficiency.

| Component | How I Used It |
| :--- | :--- |
| **HTML5** | Semantic structure is key. I used `<article>` for menu items, `<section>` for page breaks, and proper ARIA labels for accessibility. |
| **CSS3** | This is where the magic happens. I used advanced CSS variables for theming and custom keyframe animations for the floating embers. |
| **JavaScript** | No frameworks here. Just vanilla JS (ES6+) to handle the dark mode toggle, form validation, and the date-based "Today's Special" logic. |
| **Bootstrap 5** | Used strictly for the responsive grid system, navbar collapsing, and the modal/carousel components to save development time. |

> **Note:** The "Today's Special" badge is dynamic! It checks the current day of the week and displays a different special (e.g., *Wagyu Wednesday*). If you visit on a Monday (when they are closed), it politely hides itself.

---

## 📸 Key Features

### 1. The "Alive" Hero Section
The first thing you see is a full-screen hero banner with animated fire particles rising from the bottom. It frames the brand immediately: this place is about heat and energy.

### 2. A Smart Booking Form
I didn't want a dumb form. This one:
-   **Validates everything:** It won't let you book a table for 0 guests or use an invalid email.
-   **Knows the schedule:** It knows the restaurant is closed on Mondays and won't let you pick a date that has already passed.
-   **Counts your words:** A polite character counter helps you keep your special requests concise.

### 3. Dark Mode (The "Late Night" Vibe)
Dining changes from lunch to dinner, and so should the website. The dark mode toggle isn't just a filter; it completely swaps the color variables to a deep, sophisticated dark theme that's easier on the eyes at night. It even remembers your preference for next time.

### 4. An Immersive Gallery
The gallery isn't just a grid of photos. It's an interactive lightbox that lets you cycle through the high-resolution shots of the kitchen and dishes, complete with captions that tell the story of each plate.

---

## 🚀 Running the Project

You don't need a complex build pipeline to see this. Since it's standard web tech, you can:

1.  **Download** the project folder.
2.  **Open** `index.html` in any modern web browser.
3.  **That's it!** (For the best experience, I recommend using a simple local server like Live Server in VS Code to ensure all assets load perfectly).

---

## 📁 Project Structure

It's kept clean and intuitive:

```
project/
├── index.html          # The main stage
├── css/
│   └── custom.css      # The styling "sauce"
├── js/
│   └── main.js         # The logic
└── assets/             # Images and icons
```

---

## � Final Thoughts

Building Ember & Oak was a lesson in **atmosphere**. A restaurant website needs to do more than just list a menu; it needs to sell an experience. By paying attention to the micro-interactions—the way a button glows when you hover, or how the navbar solidifies as you scroll—I tried to create a site that feels as crafted as the food it promises.

I hope you enjoy exploring it as much as I enjoyed building it. 🥂

---

*Verified reliable, accessible, and responsive.*

