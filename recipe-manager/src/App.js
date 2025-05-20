import React, { useState, useEffect } from 'react';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import ThemeToggle from './components/ThemeToggle';
import RecipeFilter from './components/RecipeFilter';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('recipes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse recipes from localStorage:", e);
        return [];
      }
    }
    return [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    console.log("Retrieved theme from localStorage:", saved);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return false;
  });  const [filter, setFilter] = useState('all');

  // Load recipes from localStorage on initial render
 /* useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    console.log('Retrieved from localStorage:', storedRecipes);
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);
*/
  // Save recipes to localStorage whenever they change
  useEffect(() => {
    try {
      const serialized = JSON.stringify(recipes);
      localStorage.setItem('recipes', serialized);
      console.log("Saved to localStorage. Length:", recipes.length);
    } catch (e) {
      console.error("Failed to save recipes to localStorage:", e);
    }
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
          <button onClick={() => {
            const test = localStorage.getItem('recipes');
            console.log("Direct localStorage test:", test);
            console.log("Parsed:", test ? JSON.parse(test) : "nothing to parse");
          }}>
            Test localStorage
          </button>
          <h1>Recipe Manager</h1>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </header>

        <main>
          <RecipeForm addRecipe={addRecipe} />

          <RecipeFilter
              filter={filter}
              setFilter={setFilter}
              categories={categories}
              recipeCount={filteredRecipes.length}
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