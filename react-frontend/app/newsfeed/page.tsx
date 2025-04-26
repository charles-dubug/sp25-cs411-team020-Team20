'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingRing } from '@/components/rating-ring';
import { getSchoolNameById, getSchoolIdByName } from '../lib/schoolMapper';

interface Newsfeed {
  school: string;
  academic: number;
  tuition: number;
  location: number;
  schoolId: number;
  comment: string;
}

interface User {
  id: string;
  email: string;
  schools: string[];
}

export default function NewsfeedPage() {
  const [newsfeeds, setNewsfeeds] = useState<Newsfeed[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  // Form states
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>('');
  const [academic, setAcademic] = useState<number>(0);
  const [tuition, setTuition] = useState<number>(0);
  const [location, setLocation] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:8080/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((u: User) => {
        setUser(u);
        return fetch(`http://localhost:8080/newsfeed/user/${u.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch newsfeeds');
        return res.json();
      })
      .then((feeds: Newsfeed[]) => {
        setNewsfeeds(feeds);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!user || !selectedSchoolName) return;
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const schoolId = getSchoolIdByName(selectedSchoolName);
  
    if (typeof schoolId !== 'number') {
      alert('Invalid school selection.');
      return;
    }
  
    const newFeed = {
      id: Math.floor(Math.random() * 1000000), // random ID
      userId: Number(user.id),
      schoolId: schoolId, // CORRECTLY MAPPED
      academic: academic,
      tuition: tuition,
      location: location,
      comment: comment,
      timestamp: new Date().toISOString()
    };
  
    try {
      const res = await fetch('http://localhost:8080/newsfeed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFeed)
      });
  
      if (!res.ok) throw new Error('Failed to post newsfeed');
  
      alert('Newsfeed posted successfully!');
      window.location.reload(); // reload after posting
    } catch (error) {
      console.error(error);
      alert('Error posting newsfeed.');
    }
  };

  const filteredFeeds = newsfeeds.filter(feed => {
    const name = getSchoolNameById(feed.schoolId) ?? '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">School Review Newsfeed</h1>

      {/* New Post Form */}
      <div className="border p-6 rounded mb-8 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Post Your Own Review</h2>

        <div className="grid gap-4">
          {/* School Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Select School</label>
            <select
              value={selectedSchoolName}
              onChange={(e) => setSelectedSchoolName(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            >
              <option value="">Select a school</option>
              {user?.schools.map((school, idx) => (
                <option key={idx} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>

         {/* Ratings Row */}
        <div className="flex gap-4">
          {/* Academic Rating */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Academic Rating</label>
            <select
              value={academic}
              onChange={(e) => setAcademic(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Tuition Rating */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Tuition Rating</label>
            <select
              value={tuition}
              onChange={(e) => setTuition(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Location Rating */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Location Rating</label>
            <select
              value={location}
              onChange={(e) => setLocation(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>


          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              placeholder="Write your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-4 py-2 w-full"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search school..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      {/* Newsfeed Cards */}
      <div className="space-y-6">
        {filteredFeeds.length > 0 ? (
          filteredFeeds.map((feed, i) => {
            const schoolName = getSchoolNameById(feed.schoolId) ?? 'Unknown School';
            return (
              <Card key={i} className="w-full">
                <CardHeader>
                  <CardTitle>{schoolName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <RatingRing rating={feed.academic} label="Academic" />
                    <RatingRing rating={feed.tuition} label="Tuition" />
                    <RatingRing rating={feed.location} label="Location" />
                  </div>
                  <p className="text-sm text-muted-foreground">{feed.comment}</p>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No schools found.</p>
        )}
      </div>
    </div>
  );
}
