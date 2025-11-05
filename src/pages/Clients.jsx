import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';
import axios from 'axios';

const Clients = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'dealer_id', label: 'Dealer ID', sortable: true },
    { key: 'firm_name', label: 'Firm Name', sortable: true },
    { key: 'contact_details', label: 'Contact Details', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    { key: 'dealer_name', label: 'Dealer Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'pincode', label: 'Pincode', sortable: true },
    { key: 'gst_numb', label: 'GST Number', sortable: true },
    { key: 'telephone', label: 'Telephone', sortable: true },
  ];

  const formFields = [
    { name: 'dealer_id', label: 'Dealer ID', type: 'text', required: true },
    { name: 'firm_name', label: 'Firm Name', type: 'text', required: true },
    { name: 'contact_details', label: 'Contact Details', type: 'text', required: true },
    { name: 'district', label: 'District', type: 'text' },
    { name: 'dealer_name', label: 'Dealer Name', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'region', label: 'Region', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'gst_numb', label: 'GST Number', type: 'text' },
    { name: 'telephone', label: 'Telephone', type: 'text' },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/clients');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      toast({
        title: 'Error ❌',
        description: 'Failed to fetch clients',
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (formData) => {
    try {
      await axios.post('http://localhost:5000/clients', formData);
      toast({
        title: 'Success ✅',
        description: 'Client added successfully',
        duration: 4000,
      });
      fetchData();
    } catch (err) {
      console.error('Error adding client:', err);
      toast({
        title: 'Error ❌',
        description: 'Failed to add client',
        duration: 4000,
      });
    }
  };

  const handleEdit = async (dealer_id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/clients/${dealer_id}`, updatedData);
      toast({
        title: 'Updated ✅',
        description: 'Client updated successfully',
        duration: 4000,
      });
      fetchData();
    } catch (err) {
      console.error('Error updating client:', err);
      toast({
        title: 'Error ❌',
        description: 'Failed to update client',
        duration: 4000,
      });
    }
  };

  const handleDelete = async (dealer_id) => {
    try {
      await axios.delete(`http://localhost:5000/clients/${dealer_id}`);
      toast({
        title: 'Deleted 🗑️',
        description: 'Client deleted successfully',
        duration: 4000,
      });
      fetchData();
    } catch (err) {
      console.error('Error deleting client:', err);
      toast({
        title: 'Error ❌',
        description: 'Failed to delete client',
        duration: 4000,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Clients - Admin Panel</title>
        <meta name="description" content="Manage clients details" />
      </Helmet>
      <Layout onLogout={onLogout}>
        {/* DataTable ko custom props pass karein agar needed ho */}
        <DataTable
          title="Clients Management"
          data={data}
          columns={columns}
          formFields={formFields}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hideActions={false}
          primaryKey="dealer_id"
        />
      </Layout>
    </>
  );
};

export default Clients;