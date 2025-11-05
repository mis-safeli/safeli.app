import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const FormModal = ({ isOpen, onClose, onSubmit, fields, title, initialData = null }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else {
      const emptyData = {};
      fields.forEach(f => emptyData[f.name] = '');
      setFormData(emptyData);
    }
  }, [initialData, fields, isOpen]);

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-2xl gradient-text">{title}</DialogTitle></DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === 'select' ? (
                  <Select value={formData[f.name] || ''} onValueChange={(val) => handleChange(f.name, val)} required={f.required}>
                    <SelectTrigger><SelectValue placeholder={`Select ${f.label}`} /></SelectTrigger>
                    <SelectContent>{f.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                ) : f.type === 'textarea' ? (
                  <Textarea id={f.name} value={formData[f.name] || ''} onChange={(e) => handleChange(f.name, e.target.value)} required={f.required} rows={3} />
                ) : (
                  <Input id={f.name} type={f.type} value={formData[f.name] || ''} onChange={(e) => handleChange(f.name, e.target.value)} required={f.required} />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="gradient-bg text-white">{initialData ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
