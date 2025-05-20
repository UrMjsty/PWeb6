// src/components/RecipeItem.js
import React from 'react';

function RecipeItem({ recipe, removeRecipe, toggleLike }) {
    return (
        <div className="recipe-item">
            <div className="recipe-header">
                <h3>{recipe.title}</h3>
                <div className="recipe-actions">
                    <button
                        onClick={() => toggleLike(recipe.id)}
                        className={`like-btn ${recipe.liked ? 'liked' : ''}`}
                    >
                        {recipe.liked ? '❤️' : '🤍'}
                    </button>
                    <button onClick={() => removeRecipe(recipe.id)} className="delete-btn">
                        🗑️
                    </button>
                </div>
            </div>

            <div className="recipe-category">Category: {recipe.category}</div>

            <div className="recipe-details">
                <div className="recipe-section">
                    <h4>Ingredients:</h4>
                    <p>{recipe.ingredients}</p>
                </div>

                <div className="recipe-section">
                    <h4>Instructions:</h4>
                    <p>{recipe.instructions}</p>
                </div>
            </div>
        </div>
    );
}

export default RecipeItem;