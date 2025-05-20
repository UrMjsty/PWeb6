// src/components/RecipeFilter.js
import React from 'react';

function RecipeFilter({ filter, setFilter, categories, recipeCount }) {
    return (
        <div className="recipe-filter">
            <label htmlFor="filter">Filter by: </label>
            <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                ))}
            </select>
            <span className="recipe-count">{recipeCount} recipes</span>
        </div>
    );
}

export default RecipeFilter;