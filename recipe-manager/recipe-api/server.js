// server.js - Main Express server file
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load OpenAPI spec
const swaggerDocument = YAML.load('./openapi.yaml');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Database would go here in a real app. Using in-memory for demo
let recipes = [];
let nextId = 1;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// JWT Secret - should be in env variables in real app
const JWT_SECRET = 'your-jwt-secret-key';

// Roles and permissions
const ROLES = {
    ADMIN: { permissions: ['READ', 'WRITE', 'DELETE', 'UPDATE'] },
    WRITER: { permissions: ['READ', 'WRITE', 'UPDATE'] },
    VISITOR: { permissions: ['READ'] }
};

// Token endpoint
app.post('/token', (req, res) => {
    const { role = 'VISITOR' } = req.body;

    // Validate role exists
    if (!ROLES[role]) {
        return res.status(400).json({ error: 'Invalid role requested' });
    }

    // Create token with short expiration (1 minute)
    const token = jwt.sign(
        {
            role,
            permissions: ROLES[role].permissions
        },
        JWT_SECRET,
        { expiresIn: '4m' }
    );

    res.json({ token });
});

// Function to generate tokens for use in other parts of the app
function generateToken(userId, role) {
    // Validate role exists
    if (!ROLES[role]) {
        throw new Error('Invalid role');
    }
    console.log("User", userId);

    // Create token with user ID, role, and expiration
    return jwt.sign(
        {
            userId: userId,
            role: role,
            permissions: ROLES[role].permissions
        },
        JWT_SECRET,
        { expiresIn: '1m' } // Token expires in 24 hours
    );
}

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Check if user has permission
const hasPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions.includes(permission)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

// Check user role middleware
function checkRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
    };
}

// API Routes with CRUD operations

// Get recipes with pagination
app.get('/api/recipes', verifyToken, hasPermission('READ'), (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    // Apply pagination
    const paginatedRecipes = recipes.slice(skip, skip + limit);

    res.json({
        total: recipes.length,
        skip,
        limit,
        data: paginatedRecipes
    });
});

// Get a specific recipe
app.get('/api/recipes/:id', verifyToken, hasPermission('READ'), (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));

    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
});

// Create a new recipe
app.post('/api/recipes', verifyToken, hasPermission('WRITE'), (req, res) => {
    const { title, ingredients, instructions, category } = req.body;

    if (!title || !ingredients || !instructions || !category) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newRecipe = {
        id: nextId++,
        title,
        ingredients,
        instructions,
        category,
        liked: false,
        createdAt: new Date().toISOString()
    };

    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
});

// Update a recipe
app.put('/api/recipes/:id', verifyToken, hasPermission('UPDATE'), (req, res) => {
    const id = parseInt(req.params.id);
    const recipeIndex = recipes.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

    const updatedRecipe = {
        ...recipes[recipeIndex],
        ...req.body,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
    };

    recipes[recipeIndex] = updatedRecipe;
    res.json(updatedRecipe);
});

// Toggle recipe like status
app.put('/api/recipes/:id/like', verifyToken, hasPermission('UPDATE'), (req, res) => {
    const id = parseInt(req.params.id);
    const recipeIndex = recipes.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

    recipes[recipeIndex].liked = !recipes[recipeIndex].liked;
    res.json(recipes[recipeIndex]);
});

// Delete a recipe
app.delete('/api/recipes/:id', verifyToken, hasPermission('DELETE'), (req, res) => {
    const id = parseInt(req.params.id);
    const recipeIndex = recipes.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        return res.status(404).json({ error: 'Recipe not found' });
    }

    const deletedRecipe = recipes[recipeIndex];
    recipes = recipes.filter(r => r.id !== id);

    res.json(deletedRecipe);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
// Export functions if needed for testing or other modules
module.exports = {
    generateToken,
    verifyToken,
    checkRole,
    hasPermission
};