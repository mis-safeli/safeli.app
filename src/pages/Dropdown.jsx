import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import DataTable from '../components/DataTable.jsx';

const Dropdown = ({ onLogout }) => {
  const [selectedTable, setSelectedTable] = useState('sales');

  const tableConfigs = {
    sales: {
      title: 'Sales Data',
      storageKey: 'ksev_sales',
      columns: [
        { key: 'orderNo', label: 'Order No.', sortable: true },
        { key: 'batterySpec', label: 'Battery Spec', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true },
      ],
    },
    production: {
      title: 'Production Data',
      storageKey: 'ksev_production',
      columns: [
        { key: 'productionId', label: 'Production ID', sortable: true },
        { key: 'productName', label: 'Product Name', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
      ],
    },
    dispatch: {
      title: 'Dispatch Data',
      storageKey: 'ksev_dispatch',
      columns: [
        { key: 'dispatchId', label: 'Dispatch ID', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
      ],
    },
  };

  const currentConfig = tableConfigs[selectedTable];
  const data = JSON.parse(localStorage.getItem(currentConfig.storageKey) || '[]');

  return (
    <>
      <Helmet>
        <title>Dropdown View - KSEV Admin Panel</title>
        <meta name="description" content="Dynamic table view with dropdown selection for different data categories" />
      </Helmet>
      <Layout onLogout={onLogout}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold gradient-text">Dynamic Table View</h1>
            <div className="w-64">
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="dispatch">Dispatch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            title={currentConfig.title}
            data={data}
            columns={currentConfig.columns}
            formFields={[]}
            filters={[]}
            onAdd={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            hideActions={true}
          />
        </div>
      </Layout>
    </>
  );
};

export default Dropdown;
