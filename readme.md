# Recipe Manager
A modern, responsive web application for managing and organizing your favorite recipes. Built with React, this app allows users to add, filter, like, and delete recipes, with a sleek light/dark mode toggle for a personalized experience. Recipes are saved locally in the browser for persistence, making it easy to keep track of your culinary creations.

## Features
* Add Recipes: Create new recipes with details like title, category, ingredients, and instructions.
* Filter Recipes: Browse recipes by category or view only liked recipes.
* Like & Delete: Mark recipes as favorites with a like button or remove them as needed.
* Dark/Light Mode: Toggle between light and dark themes, with preferences saved in localStorage.
* Responsive Design: Optimized for desktops, tablets, and mobile devices with collapsible forms and touch-friendly controls.
* Local Persistence: Recipes and theme preferences are stored in the browser’s localStorage for seamless access.
## Tech Stack
* React: Frontend library for building the user interface.
* CSS: Custom styles with CSS variables for theming and responsive media queries.
* LocalStorage: For persistent storage of recipes and theme settings.
## Installation
1. Clone the Repository:
```bash
git clone [repository-url]
cd recipe-manager 
```
2. Install Dependencies:
```bash
npm install
```
3. Run the Development Server:
```bash

npm start
```
Open http://localhost:3000 (or the port specified by your setup) in your browser.
4. Build for Production (optional):
``` bash

npm run build
```

## Usage
1. Add a Recipe: Use the form to input recipe details and save them to your collection.
2. Filter Recipes: Select a category or "liked" from the dropdown to filter the displayed recipes.
3. Like or Delete: Click the heart icon to like a recipe or the trash icon to delete it.
4. Toggle Theme: Use the theme toggle button to switch between light and dark modes.

## Project Structure
- ```src/App.js```: Main application component managing state and rendering core components.
- ```src/App.css``` : Styles for the app, including theming, layout, and responsive design.
- ```src/components/RecipeList.js```: Displays a grid of recipe cards with like and delete functionality.
- ```src/components/RecipeForm.js```: Form for adding new recipes.
- ```src/components/RecipeFilter.js```: Dropdown for filtering recipes by category or liked status.
- ```src/components/ThemeToggle.js```: Button to switch between light and dark modes.

## Responsive Design
The app is fully responsive, with:

- A grid layout for recipes that adapts to screen size (1 column on mobile, 2+ on larger screens).
- Collapsible recipe form on mobile devices (below 480px).
- Touch-friendly buttons with minimum sizes (44px) for accessibility.
- Adjusted padding, font sizes, and layouts for screens down to 320px.