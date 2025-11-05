import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';

const Product = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'productId', label: 'Product ID', sortable: true },
    { key: 'productName', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'specification', label: 'Specification', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'productId', label: 'Product ID', type: 'text', required: true },
    { name: 'productName', label: 'Product Name', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'select', options: ['Battery', 'Charger', 'IOT Device', 'Solar Panel'], required: true },
    { name: 'specification', label: 'Specification', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'text', required: true },
    { name: 'stock', label: 'Stock', type: 'number', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Out of Stock', 'Discontinued'], required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'category', label: 'Category', options: ['All', 'Battery', 'Charger', 'IOT Device', 'Solar Panel'] },
    { name: 'status', label: 'Status', options: ['All', 'Available', 'Out of Stock', 'Discontinued'] },
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('ksev_product');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      const sampleData = [
        {
          id: '1',
          productId: 'PROD-001',
          productName: 'Lithium Battery 12V 7Ah',
          category: 'Battery',
          specification: '12V 7Ah, 2000 cycles',
          price: '$45',
          stock: 500,
          status: 'Available',
          remarks: 'Best seller'
        }
      ];
      setData(sampleData);
      localStorage.setItem('ksev_product', JSON.stringify(sampleData));
    }
  }, []);

  const handleAdd = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    const updatedData = [...data, item];
    setData(updatedData);
    localStorage.setItem('ksev_product', JSON.stringify(updatedData));
    toast({ title: "Success! 🎉", description: "Product record added" });
  };

  const handleEdit = (id, updatedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setData(updatedData);
    localStorage.setItem('ksev_product', JSON.stringify(updatedData));
    toast({ title: "Updated! ✅", description: "Product record updated" });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('ksev_product', JSON.stringify(updatedData));
    toast({ title: "Deleted! 🗑️", description: "Product record deleted" });
  };

  return (
    <>
      <Helmet>
        <title>Product - KSEV Admin Panel</title>
        <meta name="description" content="Manage product catalog, track inventory, and monitor product specifications" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="Product Management"
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

export default Product;