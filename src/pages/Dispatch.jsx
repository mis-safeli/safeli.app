import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';

const Dispatch = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'dispatchId', label: 'Dispatch ID', sortable: true },
    { key: 'orderNo', label: 'Order No.', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'dispatchDate', label: 'Dispatch Date', sortable: true },
    { key: 'vehicleNo', label: 'Vehicle No.', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'dispatchId', label: 'Dispatch ID', type: 'text', required: true },
    { name: 'orderNo', label: 'Order No.', type: 'text', required: true },
    { name: 'product', label: 'Product', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
    { name: 'vehicleNo', label: 'Vehicle No.', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'In Transit', 'Delivered', 'Cancelled'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'status', label: 'Status', options: ['All', 'Scheduled', 'In Transit', 'Delivered', 'Cancelled'] },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('ksev_dispatch');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      const sampleData = [
        {
          id: '1',
          dispatchId: 'DISP-001',
          orderNo: 'ORD-001',
          product: '12V 7Ah Battery',
          quantity: 100,
          dispatchDate: '2025-11-01',
          vehicleNo: 'MH-12-AB-1234',
          status: 'In Transit',
          remarks: 'Handle with care'
        }
      ];
      setData(sampleData);
      localStorage.setItem('ksev_dispatch', JSON.stringify(sampleData));
    }
  }, []);

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('ksev_dispatch', JSON.stringify(updatedData));
    toast({ title: "Success! 🎉", description: "Dispatch record added" });
  };

  const handleEdit = (id, updatedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setData(updatedData);
    localStorage.setItem('ksev_dispatch', JSON.stringify(updatedData));
    toast({ title: "Updated! ✅", description: "Dispatch record updated" });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('ksev_dispatch', JSON.stringify(updatedData));
    toast({ title: "Deleted! 🗑️", description: "Dispatch record deleted" });
  };

  return (
    <>
      <Helmet>
        <title>Dispatch - KSEV Admin Panel</title>
        <meta name="description" content="Manage dispatch schedules, track shipments, and monitor delivery status" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="Dispatch Management"
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

export default Dispatch;