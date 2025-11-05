import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useToast } from '../components/ui/use-toast';
import axios from 'axios';

const Sales = ({ onLogout }) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'order_no', label: 'Order No.', sortable: true },
    { key: 'battery_specification', label: 'Battery Specification', sortable: true },
    { key: 'application', label: 'Application', sortable: true },
    { key: 'iot', label: 'IOT', sortable: true },
    { key: 'iot_type', label: 'IOT Type', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'branding_type', label: 'Branding Type', sortable: true },
    { key: 'branding_label', label: 'Branding Label', sortable: true },
    { key: 'charger', label: 'Charger', sortable: true },
    { key: 'charger_qty', label: 'Charger QTY', sortable: true },
    { key: 'soc', label: 'SOC', sortable: true },
    { key: 'soc_qty', label: 'SOC QTY', sortable: true },
    { key: 'expected_dispatch_date', label: 'Expected Dispatch Date', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  const formFields = [
    { name: 'order_no', label: 'Order No.', type: 'text', required: true },
    { name: 'battery_specification', label: 'Battery Specification', type: 'select', options: ['12V 7Ah', '12V 12Ah', '12V 20Ah', '24V 10Ah'], required: true },
    { name: 'application', label: 'Application', type: 'select', options: ['E-Rickshaw', 'Solar', 'UPS', 'Inverter'], required: true },
    { name: 'iot', label: 'IOT', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'iot_type', label: 'IOT Type', type: 'select', options: ['1 Year','2 Year'], required: false },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'branding_type', label: 'Branding Type', type: 'select', options: ['Self', 'Co-Branding', 'Client'], required: true },
    { name: 'branding_label', label: 'Branding Label', type: 'select',options: ['Safeli','Akasha', 'CAPL - Powered by safeli'], required: false },
    { name: 'charger', label: 'Charger', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'charger_qty', label: 'Charger QTY', type: 'number', required: false },
    { name: 'soc', label: 'SOC', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'soc_qty', label: 'SOC QTY', type: 'number', required: false },
    { name: 'expected_dispatch_date', label: 'Expected Dispatch Date', type: 'date', required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  const filters = [
    { name: 'battery_specification', label: 'Battery Specification', options: ['All', '12V 7Ah', '12V 12Ah', '12V 20Ah', '24V 10Ah'] },
    { name: 'application', label: 'Application', options: ['All', 'E-Rickshaw', 'Solar', 'UPS', 'Inverter'] },
    { name: 'branding_type', label: 'Branding Type', options: ['All', 'Custom', 'Standard', 'None'] },
    { name: 'charger', label: 'Charger', options: ['All', 'Yes', 'No'] },
  ];

  // Fetch sales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/sales');
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast({ title: 'Error ❌', description: 'Failed to fetch sales data' });
      }
    };
    fetchData();
  }, []);

  // Add sale
  const handleAdd = async (newItem) => {
    try {
      const res = await axios.post('http://localhost:5000/sales', newItem);
      setData(prev => [res.data, ...prev]);
      toast({ title: "Success! 🎉", description: "Sales record added successfully" });
    } catch (err) {
      console.error('Error adding sale:', err.response?.data || err.message);
      toast({ title: 'Error ❌', description: 'Failed to add sale' });
    }
  };

  // Edit sale
const handleEdit = async (id, updatedItem) => {
  try {
    const res = await axios.put(`http://localhost:5000/sales/${updatedItem.order_no}`, updatedItem);
    setData(prev => prev.map(item => item.order_no === updatedItem.order_no ? res.data : item));
    toast({ title: "Updated! ✅", description: "Sales record updated successfully" });
  } catch (err) {
    console.error('Error updating sale:', err.response?.data || err.message);
    toast({ title: 'Error ❌', description: 'Failed to update sale' });
  }
};


  // Delete sale
  const handleDelete = async (row) => {
    if (!row || !row.order_no) return toast({ title: 'Error ❌', description: 'Order No. missing!' });
    try {
      await axios.delete(`http://localhost:5000/sales/${row.order_no}`);
      setData(prev => prev.filter(item => item.order_no !== row.order_no));
      toast({ title: "Deleted! 🗑️", description: "Sales record deleted successfully" });
    } catch (err) {
      console.error('Error deleting sale:', err.response?.data || err.message);
      toast({ title: 'Error ❌', description: 'Failed to delete sale' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sales - KSEV Admin Panel</title>
        <meta name="description" content="Manage sales orders, track battery specifications, and monitor dispatch schedules" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <DataTable
          title="Sales Management"
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

export default Sales;
