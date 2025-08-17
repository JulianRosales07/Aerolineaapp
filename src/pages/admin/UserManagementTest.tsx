import React, { useState, useEffect } from 'react';
import { usuariosAPI } from '../../services/api';

const UserManagementTest: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      console.log('Test: Starting to load users...');
      try {
        console.log('Test: Calling API...');
        const data = await usuariosAPI.getAll();
        console.log('Test: Raw API response:', data);
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Test: Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Management Test</h1>
      <p>Found {users.length} users</p>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default UserManagementTest;