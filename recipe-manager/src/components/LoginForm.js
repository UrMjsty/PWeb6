import React from 'react';

function LoginForm({ userRole, onRoleChange }) {
    const handleRoleChange = (event) => {
        onRoleChange(event.target.value);
    };

    return (
        <div className="login-form">
            <label htmlFor="role-select">Access Level: </label>
            <select
                id="role-select"
                value={userRole}
                onChange={handleRoleChange}
                className="role-select"
            >
                <option value="VISITOR">Visitor (Read Only)</option>
                <option value="WRITER">Writer (Read/Write)</option>
                <option value="ADMIN">Admin (Full Access)</option>
            </select>
        </div>
    );
}

export default LoginForm;