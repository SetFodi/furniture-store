// src/app/admin/users/page.tsx
import React from 'react';
import UserList from '@/components/admin/UserList'; // Import the component

const AdminUsersPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <UserList /> {/* Render the UserList component */}
    </div>
  );
};

export default AdminUsersPage;
