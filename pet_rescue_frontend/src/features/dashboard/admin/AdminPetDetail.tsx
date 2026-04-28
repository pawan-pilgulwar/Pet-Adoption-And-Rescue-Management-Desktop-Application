import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';

function AdminPetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/pets/${id}/pet-detail/`)
        .then(res => setPet(res.data?.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to remove ${pet?.name} from the registry?`)) return;
    try {
      await api.delete(`/pets/${id}/admin-delete-pet/`);
      alert("Pet deleted successfully");
      navigate('/admin/pets');
    } catch {
      alert("Failed to delete pet");
    }
  }

  if (loading) return <Spinner message="Loading pet info..." />;
  if (!pet) return <div className="p-8 text-center text-red-500">Pet not found</div>;

  return (
    <DetailLayout
      title={pet.name}
      subtitle={`${pet.species} • ${pet.breed || 'Mixed Breed'}`}
      backLink="/admin/pets"
      backText="Back to Registry"
      image={pet.image_url || undefined}
      stats={[
        { label: 'Pet ID', value: pet.pet_id },
        { label: 'Gender', value: pet.gender || '—' },
        { label: 'Age', value: pet.age ? `${pet.age} years` : '—' },
        { label: 'Size', value: pet.size || '—' }
      ]}
      actions={
        <Button variant="outline" className="text-red-500 hover:bg-red-50 border-red-200" onClick={handleDelete}>
          Remove from Registry
        </Button>
      }
    >
      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Description</h3>
        <p className="text-stone-700 leading-relaxed">
          {pet.description || "No description provided for this pet."}
        </p>
      </section>

      <hr className="border-stone-100" />

      <section>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Health & Metadata</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-stone-400 mb-1">Vaccination Status</p>
            <p className="font-medium text-stone-900">{pet.vaccination_status || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Color</p>
            <p className="font-medium text-stone-900">{pet.color || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Created By</p>
            <p className="font-medium text-stone-900">{pet.created_by_detail}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Registration Date</p>
            <p className="font-medium text-stone-900">{new Date(pet.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </section>
    </DetailLayout>
  );
}

export default AdminPetDetail;
