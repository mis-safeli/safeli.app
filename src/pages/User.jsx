import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';
import axios from 'axios';

const User = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'user_id', label: 'User ID', sortable: true },
    { key: 'user_name', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true },
  ];

  const formFields = [
    { name: 'user_name', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'contact', label: 'Contact', type: 'text', required: false },
    { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Manager', 'User', 'Viewer'], required: true },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: 'Error ❌',
        description: 'Failed to fetch users',
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (formData) => {
    try {
      await axios.post('http://localhost:5000/api/users', formData);
      toast({
        title: 'Success ✅',
        description: 'User added successfully',
        duration: 4000,
      });
      fetchData();
    } catch (err) {
      console.error('Error adding user:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add user';
      toast({
        title: 'Error ❌',
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  const handleEdit = async (user_id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user_id}`, updatedData);
      toast({
        title: 'Updated ✅',
        description: 'User updated successfully',
        duration: 4000,
      });
      fetchData();
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update user';
      toast({
        title: 'Error ❌',
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  const handleDelete = async (user_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${user_id}`);
      toast({
        title: 'Deleted 🗑️',
        description: 'User deleted successfully',
        duration: 4000,
      });
      fetchData();
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete user';
      toast({
        title: 'Error ❌',
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>User - KSEV Admin Panel</title>
        <meta name="description" content="Manage user accounts, roles, and access permissions" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="User Management"
          data={data}
          columns={columns}
          formFields={formFields}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hideActions={false}
          primaryKey="user_id"
        />
      </Layout>
    </>
  );
};

export default User;