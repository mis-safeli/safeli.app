import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select.jsx";
import FormModal from "./FormModal.jsx";
import DeleteDialog from "./DeleteDialog.jsx";

const DataTable = ({ title, data, columns, formFields, filters, onAdd, onEdit, onDelete, hideActions = false, primaryKey = "id" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterValues, setFilterValues] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 10;

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((item) => Object.values(item).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
    }

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== "All") result = result.filter((item) => item[key] === value);
    });

    if (sortConfig.key) {
      result.sort((a, b) => (a[sortConfig.key] < b[sortConfig.key] ? (sortConfig.direction === "asc" ? -1 : 1) : a[sortConfig.key] > b[sortConfig.key] ? (sortConfig.direction === "asc" ? 1 : -1) : 0));
    }

    return result;
  }, [data, searchTerm, filterValues, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (key) => setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));

  const handleExport = () => {
    const csv = [columns.map((c) => c.label).join(","), ...filteredAndSortedData.map((row) => columns.map((c) => row[c.key]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">{title}</h2>
        {!hideActions && (
          <div className="flex gap-3">
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="gradient-bg text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input placeholder="Search all columns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          {filters?.map((filter) => (
            <div key={filter.name} className="w-48">
              <Select value={filterValues[filter.name] || "All"} onValueChange={(val) => setFilterValues((prev) => ({ ...prev, [filter.name]: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>{filter.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`px-6 py-4 text-left text-sm font-semibold ${col.sortable ? "cursor-pointer hover:bg-white/10" : ""}`} onClick={() => col.sortable && handleSort(col.key)}>
                    <div className="flex items-center gap-2">{col.label}{col.sortable && sortConfig.key === col.key && (sortConfig.direction === "asc" ? "↑" : "↓")}</div>
                  </th>
                ))}
                {!hideActions && <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((row, idx) => (
                <motion.tr key={row[primaryKey] || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="table-row-hover border-b border-gray-100">
                  {columns.map((col) => <td key={col.key} className="px-6 py-4 text-sm text-gray-700">{row[col.key]}</td>)}

                  {!hideActions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedItem(row); setIsEditModalOpen(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedItem(row); setIsDeleteDialogOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="px-4 py-2 text-sm font-medium">Page {currentPage} of {totalPages}</span>
              <Button size="sm" variant="outline" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>

      {!hideActions && (
        <>
          <FormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={onAdd} fields={formFields} title={`Add New ${title}`} />
          <FormModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedItem(null); }} onSubmit={(data) => onEdit(selectedItem[primaryKey], data)} fields={formFields} title={`Edit ${title}`} initialData={selectedItem} />
          <DeleteDialog isOpen={isDeleteDialogOpen} onClose={() => { setIsDeleteDialogOpen(false); setSelectedItem(null); }} onConfirm={() => { onDelete(selectedItem[primaryKey]); setIsDeleteDialogOpen(false); setSelectedItem(null); }} />
        </>
      )}
    </div>
  );
};

export default DataTable;
