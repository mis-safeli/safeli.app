import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';

const Production = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'productionId', label: 'Production ID', sortable: true },
    { key: 'orderNo', label: 'Order No.', sortable: true },
    { key: 'productName', label: 'Product Name', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'productionDate', label: 'Production Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'productionId', label: 'Production ID', type: 'text', required: true },
    { name: 'orderNo', label: 'Order No.', type: 'text', required: true },
    { name: 'productName', label: 'Product Name', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'productionDate', label: 'Production Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'On Hold'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'status', label: 'Status', options: ['All', 'Pending', 'In Progress', 'Completed', 'On Hold'] },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('ksev_production');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      const sampleData = [
        {
          id: '1',
          productionId: 'PROD-001',
          orderNo: 'ORD-001',
          productName: '12V 7Ah Battery',
          quantity: 100,
          productionDate: '2025-10-15',
          status: 'Completed',
          remarks: 'Quality checked'
        }
      ];
      setData(sampleData);
      localStorage.setItem('ksev_production', JSON.stringify(sampleData));
    }
  }, []);

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('ksev_production', JSON.stringify(updatedData));
    toast({ title: "Success! 🎉", description: "Production record added" });
  };

  const handleEdit = (id, updatedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setData(updatedData);
    localStorage.setItem('ksev_production', JSON.stringify(updatedData));
    toast({ title: "Updated! ✅", description: "Production record updated" });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('ksev_production', JSON.stringify(updatedData));
    toast({ title: "Deleted! 🗑️", description: "Production record deleted" });
  };

  return (
    <>
      <Helmet>
        <title>Production - KSEV Admin Panel</title>
        <meta name="description" content="Track production batches, monitor manufacturing status, and manage production schedules" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="Production Management"
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

export default Production;