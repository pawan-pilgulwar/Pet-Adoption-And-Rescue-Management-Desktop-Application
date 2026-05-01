import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { Pet, UserProfile, ShopOwnerProfile } from '../../../types';

import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';

function AdminPetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'danger' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'info' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
      type
    });
  };

  useEffect(() => {
    if (id) {
      api.get(`/pets/${id}/pet-detail/`)
        .then(res => setPet(res.data?.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    showConfirm(
      "Remove from Registry",
      `Are you sure you want to remove ${pet?.name} from the global registry?`,
      async () => {
        try {
          await api.delete(`/pets/${id}/admin-delete-pet/`);
          navigate('/admin/pets');
        } catch {
          showAlert("Error", "Failed to delete pet", "danger");
        }
      },
      'danger'
    );
  };

  if (loading) return <Spinner message="Loading pet info..." />;
  if (!pet) return <div className="p-8 text-center text-red-500">Pet not found</div>;

  const creator = pet.created_by;
  const owner = pet.owner;

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
      <div className="space-y-12">
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">About {pet.name}</h3>
          <p className="text-stone-700 leading-relaxed italic bg-stone-50 p-6 rounded-3xl border border-stone-100">
            "{pet.description || "No description provided for this pet."}"
          </p>
        </section>

        <hr className="border-stone-100" />

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Health & Stats</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
                <span className="text-stone-500 text-sm font-medium">Vaccination Status</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                  {pet.vaccination_status || 'Unknown'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
                <span className="text-stone-500 text-sm font-medium">Color</span>
                <span className="font-semibold text-stone-900">{pet.color || '—'}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center">
                <span className="text-stone-500 text-sm font-medium">Registration Date</span>
                <span className="font-semibold text-stone-900">{new Date(pet.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Creator / Registered By</h3>
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
                  {creator.profile?.profile_picture_url ? (
                    <img src={creator.profile.profile_picture_url} alt={creator.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-lg uppercase">
                      {creator.username.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-stone-900">{creator.first_name} {creator.last_name}</p>
                  <p className="text-stone-500 text-xs">@{creator.username} • {creator.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-stone-900 font-medium">{creator.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="text-stone-900 font-medium">
                    {(creator.profile as UserProfile)?.phone_number || (creator.profile as ShopOwnerProfile)?.phone_number || '—'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {owner && (
          <>
            <hr className="border-stone-100" />
            <section>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Current Owner Details</h3>
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-stone-200">
                  {owner.profile?.profile_picture_url ? (
                    <img src={owner.profile.profile_picture_url} alt={owner.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase">
                      {owner.username.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-stone-900 text-lg">{owner.first_name} {owner.last_name}</p>
                      <p className="text-stone-500 text-sm">@{owner.username} • {owner.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400 uppercase font-bold mb-1">Contact</p>
                      <p className="text-stone-900 font-semibold">{owner.email}</p>
                      <p className="text-stone-600 text-sm font-medium">
                        {(owner.profile as UserProfile)?.phone_number || (owner.profile as ShopOwnerProfile)?.phone_number || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>


      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        type={modalConfig.type}
      />
    </DetailLayout>
  );
}

export default AdminPetDetail;
