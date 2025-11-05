import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';

const Purchase = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'purchaseId', label: 'Purchase ID', sortable: true },
    { key: 'vendor', label: 'Vendor', sortable: true },
    { key: 'item', label: 'Item', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'purchaseDate', label: 'Purchase Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'purchaseId', label: 'Purchase ID', type: 'text', required: true },
    { name: 'vendor', label: 'Vendor', type: 'text', required: true },
    { name: 'item', label: 'Item', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'amount', label: 'Amount', type: 'text', required: true },
    { name: 'purchaseDate', label: 'Purchase Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Received', 'Cancelled'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'status', label: 'Status', options: ['All', 'Pending', 'Approved', 'Received', 'Cancelled'] },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('ksev_purchase');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      const sampleData = [
        {
          id: '1',
          purchaseId: 'PUR-001',
          vendor: 'ABC Suppliers',
          item: 'Battery Cells',
          quantity: 500,
          amount: '$25,000',
          purchaseDate: '2025-10-10',
          status: 'Received',
          remarks: 'Quality verified'
        }
      ];
      setData(sampleData);
      localStorage.setItem('ksev_purchase', JSON.stringify(sampleData));
    }
  }, []);

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('ksev_purchase', JSON.stringify(updatedData));
    toast({ title: "Success! 🎉", description: "Purchase record added" });
  };

  const handleEdit = (id, updatedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setData(updatedData);
    localStorage.setItem('ksev_purchase', JSON.stringify(updatedData));
    toast({ title: "Updated! ✅", description: "Purchase record updated" });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('ksev_purchase', JSON.stringify(updatedData));
    toast({ title: "Deleted! 🗑️", description: "Purchase record deleted" });
  };

  return (
    <>
      <Helmet>
        <title>Purchase - KSEV Admin Panel</title>
        <meta name="description" content="Manage purchase orders, track vendor transactions, and monitor procurement" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="Purchase Management"
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

export default Purchase;