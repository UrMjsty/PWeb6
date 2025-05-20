import React from 'react';
import RecipeItem from './RecipeItem';

function RecipeList({ recipes, removeRecipe, toggleLike }) {
    if (recipes.length === 0) {
        return <p className="no-recipes">No recipes found. Add some recipes!</p>;
    }

    return (
        <div className="recipe-list">
            {recipes.map(recipe => (
                <RecipeItem
                    key={recipe.id}
                    recipe={recipe}
                    removeRecipe={removeRecipe}
                    toggleLike={toggleLike}
                />
            ))}
        </div>
    );
}

export default RecipeList;
