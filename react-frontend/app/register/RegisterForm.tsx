// RegisterForm.tsx
import React, { FC, useState } from 'react';

interface RegisterFormProps {
  // The parent onSubmit function takes (name, email, password) and returns either
  // a Promise<void> if async, or void if synchronous.
  onSubmit: (name: string, email: string, password: string) => Promise<void> | void;
  error: string | null;
}

const RegisterForm: FC<RegisterFormProps> = ({ onSubmit, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the parent’s onSubmit prop, passing the form inputs
    await onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
