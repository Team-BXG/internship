import { useState, useEffect } from 'react';
import SupplierList from './SupplierList';
import RegisterSupplier from './RegisterSupplier';
import SupplierDetails from './SupplierDetails';

export default function SupplierManagement() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'register', 'details'
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = () => {
    setLoading(true);
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/suppliers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          console.error("Error expected array but got:", data);
          setSuppliers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching suppliers:", err);
        setSuppliers([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentView === 'list') {
      fetchSuppliers();
    }
  }, [currentView]);

  const viewDetails = (id) => {
    setSelectedSupplierId(id);
    setCurrentView('details');
  };

  if (loading && currentView === 'list') {
    return <div className="flex h-full items-center justify-center font-bold text-slate-400">Loading Suppliers...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {currentView === 'list' && (
        <SupplierList 
          suppliers={suppliers} 
          onRegister={() => setCurrentView('register')} 
          onViewDetails={viewDetails}
        />
      )}
      {currentView === 'register' && (
        <RegisterSupplier 
          onCancel={() => setCurrentView('list')} 
          onSuccess={() => {
             setCurrentView('list');
             fetchSuppliers();
          }}
        />
      )}
      {currentView === 'details' && (
        <SupplierDetails 
          supplierId={selectedSupplierId} 
          onBack={() => setCurrentView('list')} 
        />
      )}
    </div>
  );
}
