'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface School {
  id: number;
  name: string;
  location: string;
  tuition: number;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTuition, setNewTuition] = useState<number>(0);

  const fetchSchools = () => {
    fetch('http://localhost:8080/schools')
      .then(res => res.json())
      .then((data: School[]) => setSchools(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleCreate = async () => {
    if (!newName || !newLocation || newTuition <= 0) {
      alert('Please fill out all fields and set a tuition > 0');
      return;
    }

    const payload = {
      name: newName,
      location: newLocation,
      tuition: newTuition,
    };

    try {
      const res = await fetch('http://localhost:8080/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      // reset form & reload
      setNewName('');
      setNewLocation('');
      setNewTuition(0);
      fetchSchools();
    } catch (err: any) {
      console.error(err);
      alert('Error creating school: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this school?')) return;
    try {
      const res = await fetch(`http://localhost:8080/schools/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(await res.text());
      fetchSchools();
    } catch (err: any) {
      console.error(err);
      alert('Error deleting school: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Schools</h1>

      {/* Create School Form */}
      <div className="border p-6 rounded mb-8 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Add a New School</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tuition</label>
            <input
              type="number"
              value={newTuition}
              onChange={e => setNewTuition(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="mt-6 bg-blue-500 hover:bg-blue-600">
          Create School
        </Button>
      </div>

      {/* Schools List */}
      <div className="space-y-6">
        {schools.length > 0 ? (
          schools.map(school => (
            <Card key={school.id} className="w-full">
              <CardHeader>
                <CardTitle>{school.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p><strong>Location:</strong> {school.location}</p>
                  <p><strong>Tuition:</strong> ${school.tuition.toFixed(2)}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(school.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No schools available.</p>
        )}
      </div>
    </div>
  );
}
