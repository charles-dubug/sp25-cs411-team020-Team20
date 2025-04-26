'use client';
// Register.tsx
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import styles from './Register.module.css';

// If there are no props to pass in, you can define an empty interface or omit it
interface RegisterProps {}

// Optional: define the response shape if you want more specific typing
interface RegisterResponse {
  token: string;
}

const Register: FC<RegisterProps> = () => {
  // error can be a string or null
  const [error, setError] = useState<string | null>(null);

  // handleRegister is async, returning a Promise<void>
  // We type the parameters as strings
  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // If you know the response shape, cast it to RegisterResponse
        const data: RegisterResponse = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/welcome'; // Redirect to welcome page
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Registration failed!');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <RegisterForm onSubmit={handleRegister} error={error} />
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
