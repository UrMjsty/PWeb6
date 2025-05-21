import React, { useState, useEffect } from 'react';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import ThemeToggle from './components/ThemeToggle';
import RecipeFilter from './components/RecipeFilter';
import recipeApi from './frontend-api.js';
import './App.css';
import LoginForm from "./components/LoginForm";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('VISITOR');
  const [pagination, setPagination] = useState({
    limit: 10,
    skip: 0,
    total: 0
  });
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
  useEffect(() => {
    const initializeUser = async () => {
      try {
        await recipeApi.getToken(userRole);
        fetchRecipes();
      } catch (err) {
        setError("Failed to authenticate. Please try again.");
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [userRole]);
  // Fetch recipes with pagination
  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recipeApi.getRecipes(pagination.limit, pagination.skip);
      setRecipes(response.data);
      setPagination({
        ...pagination,
        total: response.total
      });
      setIsLoading(false);
    } catch (err) {
      setError("Could not fetch recipes. " + err.message);
      setIsLoading(false);
    }
  };

  // Handle role change
  const handleRoleChange = async (role) => {
    setUserRole(role);
    try {
      await recipeApi.getToken(role);
      fetchRecipes();
    } catch (err) {
      setError("Failed to change role. Please try again.");
    }
  };
  const addRecipe = async (recipe) => {
    try {
      await recipeApi.createRecipe(recipe);
      fetchRecipes(); // Refresh recipes after adding
    } catch (err) {
      setError("Failed to add recipe: " + err.message);
    }
  };

  // Remove a recipe through API
  const removeRecipe = async (id) => {
    try {
      await recipeApi.deleteRecipe(id);
      fetchRecipes(); // Refresh recipes after deleting
    } catch (err) {
      setError("Failed to delete recipe: " + err.message);
    }
  };

  // Toggle like through API
  const toggleLike = async (id) => {
    try {
      await recipeApi.toggleLike(id);
      fetchRecipes(); // Refresh recipes after toggling like
    } catch (err) {
      setError("Failed to update recipe: " + err.message);
    }
  };

  // Handle pagination
  const handlePageChange = (newSkip) => {
    setPagination({
      ...pagination,
      skip: newSkip
    });
  };

  // Load more recipes
  const loadMore = () => {
    setPagination({
      ...pagination,
      skip: pagination.skip + pagination.limit
    });
  };

  // Effect for pagination changes
  useEffect(() => {
    fetchRecipes();
  }, [pagination.skip, pagination.limit]);

  // Dark mode effect remains the same
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);


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
          <div className="header-controls">
            <LoginForm userRole={userRole} onRoleChange={handleRoleChange} />
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </header>

        <main>
          {error && <div className="error-message">{error}</div>}

          {userRole !== 'VISITOR' && <RecipeForm addRecipe={addRecipe} />}

          <RecipeFilter
              filter={filter}
              setFilter={setFilter}
              categories={categories}
              recipeCount={filteredRecipes.length}
          />

          {isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
              </div>
          ) : (
              <>
                <RecipeList
                    recipes={filteredRecipes}
                    removeRecipe={removeRecipe}
                    toggleLike={toggleLike}
                    userRole={userRole}
                />

                {/* Pagination controls */}
                <div className="pagination">
                  {pagination.skip > 0 && (
                      <button
                          onClick={() => handlePageChange(Math.max(0, pagination.skip - pagination.limit))}
                          className="pagination-btn"
                      >
                        Previous
                      </button>
                  )}

                  {pagination.skip + pagination.limit < pagination.total && (
                      <button
                          onClick={loadMore}
                          className="pagination-btn"
                      >
                        Next
                      </button>
                  )}
                </div>
              </>
          )}
        </main>
      </div>
  );
}


export default App;