'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface User {
  id: string;
  email: string;
  schools: string[];
}

interface ProfileFormProps {
  user: User;
  onUpdateSchools: (schools: string[]) => Promise<void>;
  onClearPreference: () => Promise<void>;
}

interface RatingData {
  email: string;
  school: string;
  academic: number;
  tuition: number;
  location: number;
  comment: string;
}

const RatingModal: React.FC<{
  email: string;
  school: string;
  onSubmit: (data: RatingData) => void;
  onClose: () => void;
}> = ({ email, school, onSubmit, onClose }) => {
  const [academicRating, setAcademicRating] = useState(0);
  const [tuitionRating, setTuitionRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const data: RatingData = {
      email,
      school,
      academic: academicRating,
      tuition: tuitionRating,
      location: locationRating,
      comment,
    };
    onSubmit(data);
    onClose();
  };

  const RatingStars: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className={`p-0 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => setRating(star)}
        >
          ★
        </Button>
      ))}
    </div>
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rate {school}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Academic:</Label>
          <RatingStars rating={academicRating} setRating={setAcademicRating} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Tuition:</Label>
          <RatingStars rating={tuitionRating} setRating={setTuitionRating} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Location:</Label>
          <RatingStars rating={locationRating} setRating={setLocationRating} />
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comments"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </DialogContent>
  );
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdateSchools, onClearPreference }) => {
  const [newSchool, setNewSchool] = useState('');
  const [schools, setSchools] = useState<string[]>(
    Array.isArray(user.schools) ? user.schools : user.schools ? JSON.parse(user.schools) : []
  );
  
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchool.trim() && !schools.includes(newSchool.trim())) {
      const updatedSchools = [...schools, newSchool.trim()];
      console.log('Updated Schools:', updatedSchools);
      setSchools(updatedSchools);
      onUpdateSchools(updatedSchools);
      setNewSchool('');
    } else {
      alert('Invalid or duplicate school name');
    }
  };

  const handleRemoveSchool = (index: number) => {
    const updatedSchools = schools.filter((_, i) => i !== index);
    setSchools(updatedSchools);
    onUpdateSchools(updatedSchools);
  };

  const submitRating = async (data: RatingData) => {
    try {
      const response = await fetch('http://localhost:8080/newsfeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Rating submitted successfully!');
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Email:</Label>
        <div>{user.email}</div>
      </div>
      <div>
        <Label>School Preferences:</Label>
        <ul className="mt-2 space-y-2">
          {schools.map((school, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{school}</span>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSchool(school)}>
                      Rate
                    </Button>
                  </DialogTrigger>
                  {selectedSchool === school && (
                    <RatingModal
                      email={user.email}
                      school={school}
                      onSubmit={(data) => {
                        console.log('Submitting rating:', data);
                        submitRating(data);
                      }}
                      onClose={() => setSelectedSchool(null)}
                    />
                  )}
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveSchool(index)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleAddSchool} className="flex space-x-2">
        <Input
          type="text"
          value={newSchool}
          onChange={(e) => setNewSchool(e.target.value)}
          placeholder="Enter school name"
        />
        <Button type="submit">Add School</Button>
        
        
      
      </form>
      <Button
          variant="destructive"
          size="sm"
          onClick={onClearPreference}
        >
          Clear All Preferences
        </Button>
    </div>
  );
};

export default ProfileForm;

