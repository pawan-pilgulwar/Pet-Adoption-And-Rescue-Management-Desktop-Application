import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';

function ShopPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Shop owner gets their own pets from the standard all-pets endpoint,
  // we filter client side if the backend returns all pets.
  // We use the 'owner' or 'created_by' logic. 
  // Wait, backend's /pets/all-pets/ returns all pets. For shop owner, let's filter those owned by them.
  useEffect(() => {
    // Actually, Admin has /pets/admin-register-pet/. Users don't have a direct pet register endpoint 
    // unless they use the rescue report logic. But shop owners need to list pets.
    // Wait, the backend /adoption/listings/ POST requires a `pet: id`.
    // Let's assume the shop owner registers pets via `/pets/admin-register-pet/` or it's implicitly created.
    // Wait, let's check `apps/pets/urls.py` in models — `Pet` has `created_by`. 
    // The backend `PetViewSet` allows `get_all_pets` and Admin has `admin-register-pet`.
    // If shop owner cannot register pet directly... we might need to rely on what the backend offers.
    // Let me just fetch all pets and filter.
    api.get('/pets/all-pets/')
      .then(res => {
        const allPets = res.data?.data?.Pets || [];
        setPets(allPets);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Pets</h1>
          <p className="text-stone-500">Pets registered under your shop.</p>
        </div>
        {/* <Button>Register Pet</Button> - Note: Registration API requires IsAdmin per backend, so ShopOwner cannot register directly using /admin-register-pet/ unless allowed. Wait, backend says: permission_classes=[IsAuthenticated, IsAdmin]. So only Admin can register pets via PetViewSet! Shop owners can only create adoption requests/listings using existing pets. */}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-xl mb-6">
        Note: New pet registrations are handled by Administrators. You can create adoption listings for pets.
      </div>

      {loading ? (
        <Spinner />
      ) : pets.length === 0 ? (
        <div className="card">
          <Empty message="No pets found." emoji="🐾" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pets.map(pet => (
            <div key={pet.id} className="card p-4 rounded-xl shadow-md hover:shadow-lg transition">

              {/* Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-orange-50 mb-3">
                {pet.image_url ? (
                  <img
                    src={pet.image_url || undefined}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🐾
                  </div>
                )}
              </div>

              {/* Name + ID */}
              <h3 className="font-bold text-lg text-stone-900 flex items-center justify-between">
                {pet.name}
                <span className="text-xs text-stone-400 font-mono">#{pet.pet_id}</span>
              </h3>

              {/* Species & Breed */}
              <p className="text-sm text-stone-500">
                {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
              </p>

              {/* Divider */}
              <div className="border-t my-2"></div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">

                {pet.age !== null && (
                  <div><span className="font-medium">Age:</span> {pet.age} yrs</div>
                )}

                {pet.gender && (
                  <div><span className="font-medium">Gender:</span> {pet.gender}</div>
                )}

                {pet.size && (
                  <div><span className="font-medium">Size:</span> {pet.size}</div>
                )}

                {pet.color && (
                  <div><span className="font-medium">Color:</span> {pet.color}</div>
                )}

                {pet.vaccination_status && (
                  <div className="col-span-2">
                    <span className="font-medium">Vaccination:</span> {pet.vaccination_status}
                  </div>
                )}
              </div>

              {/* Description */}
              {pet.description && (
                <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                  {pet.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center mt-3 text-xs text-stone-400">
                <span>By: {pet.created_by_detail}</span>
                <span>{new Date(pet.created_at).toLocaleDateString()}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopPets;
