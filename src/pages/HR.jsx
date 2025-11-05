import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';

const HR = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'joinDate', label: 'Join Date', sortable: true },
    { key: 'salary', label: 'Salary', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'select', options: ['Sales', 'Production', 'R&D', 'HR', 'Finance'], required: true },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'joinDate', label: 'Join Date', type: 'date', required: true },
    { name: 'salary', label: 'Salary', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'On Leave', 'Resigned'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'department', label: 'Department', options: ['All', 'Sales', 'Production', 'R&D', 'HR', 'Finance'] },
    { name: 'status', label: 'Status', options: ['All', 'Active', 'On Leave', 'Resigned'] },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('ksev_hr');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      const sampleData = [
        {
          id: '1',
          employeeId: 'EMP-001',
          name: 'John Doe',
          department: 'Sales',
          position: 'Sales Manager',
          joinDate: '2024-01-15',
          salary: '$45,000',
          status: 'Active',
          remarks: 'Top performer'
        }
      ];
      setData(sampleData);
      localStorage.setItem('ksev_hr', JSON.stringify(sampleData));
    }
  }, []);

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('ksev_hr', JSON.stringify(updatedData));
    toast({ title: "Success! 🎉", description: "Employee record added" });
  };

  const handleEdit = (id, updatedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setData(updatedData);
    localStorage.setItem('ksev_hr', JSON.stringify(updatedData));
    toast({ title: "Updated! ✅", description: "Employee record updated" });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('ksev_hr', JSON.stringify(updatedData));
    toast({ title: "Deleted! 🗑️", description: "Employee record deleted" });
  };

  return (
    <>
      <Helmet>
        <title>HR - KSEV Admin Panel</title>
        <meta name="description" content="Manage employee records, track departments, and monitor HR operations" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="HR Management"
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

export default HR;