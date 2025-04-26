// src/components/Welcome.js
import React, { useEffect } from 'react';

const Welcome = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized! Please log in.');
            window.location.href = '/';
        }
    }, []);

    return (
        <div>
            <h1>Welcome!</h1>
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Welcome;
