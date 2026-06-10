import { useState, useEffect } from 'react';
import ContractorList from './ContractorList';
import RegisterContractor from './RegisterContractor';
import ContractorDetails from './ContractorDetails';



export default function ContractorRegistration() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'register', 'details'
  const [selectedContractorId, setSelectedContractorId] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContractors = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/contractors')
      .then(res => res.json())
      .then(data => {
        setContractors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching contractors:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentView === 'list') {
      fetchContractors();
    }
  }, [currentView]);

  const viewDetails = (id) => {
    setSelectedContractorId(id);
    setCurrentView('details');
  };

  if (loading && currentView === 'list') {
    return <div className="flex h-full items-center justify-center font-bold text-slate-400">Loading Contractors...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {currentView === 'list' && (
        <ContractorList 
          contractors={contractors} 
          onRegister={() => setCurrentView('register')} 
          onViewDetails={viewDetails}
        />
      )}
      {currentView === 'register' && (
        <RegisterContractor 
          onCancel={() => setCurrentView('list')} 
          onSuccess={() => {
             setCurrentView('list');
             fetchContractors();
          }}
        />
      )}
      {currentView === 'details' && (
        <ContractorDetails 
          contractorId={selectedContractorId} 
          contractor={contractors.find(c => c.id === selectedContractorId)}
          onBack={() => setCurrentView('list')} 
        />
      )}
    </div>
  );
}
