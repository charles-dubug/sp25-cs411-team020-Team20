'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProfileForm from './ProfileForm';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  schools: string[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);  
  const router = useRouter();
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 401) {
        // Token is invalid or expired, redirect to login page
        localStorage.removeItem('token'); // Clear the invalid token
        router.push('/login');
      } else if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load user profile');
    }
  };

  const handleUpdateSchools = async (updatedSchools: string[]) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:8080/auth/${user.id}/schools`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedSchools),
      });
  
      if (response.ok) {
        setUser({ ...user, schools: updatedSchools });
      } else {
        throw new Error('Failed to update schools');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update schools');
    }
  };

  const handleClearPreferences = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:8080/auth/${user.id}/schools`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (response.status === 204) {
        setUser({ ...user, schools: [] });
      } else {
        throw new Error('Failed to clear preferences');
      }
    } catch (err) {
      console.error(err);
      alert('Could not clear preferences');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm
          user={user}
          onUpdateSchools={handleUpdateSchools}
          onClearPreference={handleClearPreferences}
       />
      </CardContent>
    </Card>
  );


};



export default Profile;

