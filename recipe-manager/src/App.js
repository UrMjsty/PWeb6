import React, { useState, useEffect } from 'react';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import ThemeToggle from './components/ThemeToggle';
import RecipeFilter from './components/RecipeFilter';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');

  // Load recipes from localStorage on initial render
  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  // Save darkMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now(),
      liked: false
    };
    setRecipes([...recipes, newRecipe]);
  };

  const removeRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const toggleLike = (id) => {
    setRecipes(recipes.map(recipe =>
        recipe.id === id ? { ...recipe, liked: !recipe.liked } : recipe
    ));
  };

  const filteredRecipes = filter === 'all'
      ? recipes
      : filter === 'liked'
          ? recipes.filter(recipe => recipe.liked)
          : recipes.filter(recipe => recipe.category === filter);

  const categories = ['all', 'liked', ...new Set(recipes.map(recipe => recipe.category))];

  return (
      <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <header>
          <h1>Recipe Manager</h1>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </header>

        <main>
          <RecipeForm addRecipe={addRecipe} />

          <RecipeFilter
              filter={filter}
              setFilter={setFilter}
              categories={categories}
          />

          <RecipeList
              recipes={filteredRecipes}
              removeRecipe={removeRecipe}
              toggleLike={toggleLike}
          />
        </main>
      </div>
  );
}

export default App;