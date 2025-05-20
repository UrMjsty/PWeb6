// src/components/RecipeForm.js
import React, { useState } from 'react';

function RecipeForm({ addRecipe }) {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !ingredients || !instructions || !category) return;

        addRecipe({
            title,
            ingredients,
            instructions,
            category
        });

        // Reset form
        setTitle('');
        setIngredients('');
        setInstructions('');
        setCategory('');
    };

    return (
        <div className="recipe-form-container">
            <h2>Add New Recipe</h2>
            <form onSubmit={handleSubmit} className="recipe-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Recipe title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Dessert, Main Course, etc."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients:</label>
                    <textarea
                        id="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="One ingredient per line"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="instructions">Instructions:</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Step-by-step instructions"
                        rows="3"
                    />
                </div>

                <button type="submit" className="add-btn">Add Recipe</button>
            </form>
        </div>
    );
}

export default RecipeForm;