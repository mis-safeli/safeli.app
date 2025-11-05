import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';

const RnD = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'projectId', label: 'Project ID', sortable: true },
    { key: 'projectName', label: 'Project Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'budget', label: 'Budget', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'projectId', label: 'Project ID', type: 'text', required: true },
    { name: 'projectName', label: 'Project Name', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'select', options: ['Battery Tech', 'IOT', 'Solar', 'Innovation'], required: true },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Planning', 'Active', 'Testing', 'Completed'], required: true },
    { name: 'budget', label: 'Budget', type: 'text', required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'category', label: 'Category', options: ['All', 'Battery Tech', 'IOT', 'Solar', 'Innovation'] },
    { name: 'status', label: 'Status', options: ['All', 'Planning', 'Active', 'Testing', 'Completed'] },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('ksev_rnd');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      const sampleData = [
        {
          id: '1',
          projectId: 'RND-001',
          projectName: 'Advanced Battery Cell',
          category: 'Battery Tech',
          startDate: '2025-09-01',
          status: 'Active',
          budget: '$50,000',
          remarks: 'High priority'
        }
      ];
      setData(sampleData);
      localStorage.setItem('ksev_rnd', JSON.stringify(sampleData));
    }
  }, []);

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('ksev_rnd', JSON.stringify(updatedData));
    toast({ title: "Success! 🎉", description: "R&D project added" });
  };

  const handleEdit = (id, updatedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setData(updatedData);
    localStorage.setItem('ksev_rnd', JSON.stringify(updatedData));
    toast({ title: "Updated! ✅", description: "R&D project updated" });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('ksev_rnd', JSON.stringify(updatedData));
    toast({ title: "Deleted! 🗑️", description: "R&D project deleted" });
  };

  return (
    <>
      <Helmet>
        <title>R&D - KSEV Admin Panel</title>
        <meta name="description" content="Manage research and development projects, track innovation initiatives" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="R&D Management"
          data={data}
          columns={columns}
          formFields={formFields}
          filters={filters}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Layout>
    </>
  );
};

export default RnD;