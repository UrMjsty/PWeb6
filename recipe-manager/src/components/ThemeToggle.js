// src/components/ThemeToggle.js
import React from 'react';

function ThemeToggle({ darkMode, setDarkMode }) {
    return (
        <div className="theme-toggle">
            <button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
        </div>
    );
}

export default ThemeToggle;