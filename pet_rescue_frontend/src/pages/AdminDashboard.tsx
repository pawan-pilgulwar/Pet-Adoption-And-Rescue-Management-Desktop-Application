import React, { useState, useEffect } from 'react';
import { adminService, reportService, petService, authService, BASE_URL } from '../services/api';
import DashboardTable from '../components/DashboardTable';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For Pet Modal (Create/Update)
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [petForm, setPetForm] = useState<any>({
    name: '',
    pet_type: '',
    breed: '',
    color: '',
    status: 'Available',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const statsRes = await adminService.getStats();
        setStats(statsRes.data);
      } else if (activeTab === 'reports') {
        const reportsRes = await reportService.adminGetAll();
        setReports(reportsRes.data.Reports || []);
      } else if (activeTab === 'users') {
        const usersRes = await adminService.getUsers();
        setUsers(usersRes.data.users || []);
      } else if (activeTab === 'pets') {
        const petsRes = await petService.adminGetAll();
        console.log(petsRes.data.pets);
        setPets(petsRes.data.pets || []);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReportStatus = async (id: number, newStatus: string) => {
    try {
      await reportService.adminUpdate(id, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(petForm).forEach(key => {
        const value = petForm[key];
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      if (editingPet) {
        await petService.update(editingPet.id, data);
      } else {
        await petService.register(data);
      }
      setIsPetModalOpen(false);
      setEditingPet(null);
      setPetForm({ name: '', pet_type: '', breed: '', color: '', status: 'Available', image: null });
      setImagePreview(null);
      fetchData();
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  };

  const handleDeletePet = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  const openPetModal = (pet: any = null) => {
    if (pet) {
      setEditingPet(pet);
      setPetForm({
        name: pet.name,
        pet_type: pet.pet_type,
        breed: pet.breed || '',
        color: pet.color || '',
        status: pet.status,
        image: null
      });
      const imageUrl = pet.image ? (pet.image.startsWith('http') ? pet.image : `${BASE_URL}${pet.image}`) : null;
      setImagePreview(imageUrl);
    } else {
      setEditingPet(null);
      setPetForm({ name: '', pet_type: '', breed: '', color: '', status: 'Available', image: null });
      setImagePreview(null);
    }
    setIsPetModalOpen(true);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Users</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stats.total_users}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Active</span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Reports</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stats.total_reports}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Adoptable</span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Pets</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stats.total_pets || 0}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
      </div>
      <DashboardTable
        headers={['ID', 'Username', 'Email', 'Role', 'Joined Date']}
        data={users}
        renderRow={(user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-gray-900">{user.username}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                }`}>
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(user.created_at).toLocaleDateString()}
            </td>
          </tr>
        )}
      />
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rescue Reports</h1>
      <DashboardTable
        headers={['ID', 'Image', 'Pet Name', 'Reporter', 'Status', 'Date', 'Actions']}
        data={reports}
        renderRow={(report) => (
          <tr key={report.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{report.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {report.pet_detail?.image && (
                <img
                  src={report.pet_detail.image.startsWith('http') ? report.pet_detail.image : `${BASE_URL}${report.pet_detail.image}`}
                  alt=""
                  className="h-10 w-10 object-cover rounded-lg border border-gray-100"
                />
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{report.pet_detail?.name || 'Unknown'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.user_detail || 'Unknown User'}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                report.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                {report.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(report.created_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {report.status === 'Pending' && (
                <div className="space-x-3">
                  <button onClick={() => handleUpdateReportStatus(report.id, 'Accepted')} className="text-blue-600 hover:text-blue-900 font-bold">Approve</button>
                  <button onClick={() => handleUpdateReportStatus(report.id, 'Rejected')} className="text-red-600 hover:text-red-900 font-bold">Reject</button>
                </div>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );

  const renderPets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Adoptable Pets</h1>
        <button
          onClick={() => openPetModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
        >
          + Add New Pet
        </button>
      </div>
      <DashboardTable
        headers={['ID', 'Image', 'Name', 'Type', 'Breed', 'Status', 'Actions']}
        data={pets}
        renderRow={(pet) => (
          <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pet.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {pet.image && (
                <img
                  src={pet.image.startsWith('http') ? pet.image : `${BASE_URL}${pet.image}`}
                  alt=""
                  className="h-10 w-10 object-cover rounded-lg border border-gray-100"
                />
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{pet.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.pet_type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.breed || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pet.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                {pet.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="space-x-3">
                <button onClick={() => openPetModal(pet)} className="text-blue-600 hover:text-blue-900 font-bold">Edit</button>
                <button onClick={() => handleDeletePet(pet.id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
              </div>
            </td>
          </tr>
        )}
      />

      {isPetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{editingPet ? 'Update Pet' : 'Register New Pet'}</h2>
            <form onSubmit={handlePetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Type</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={petForm.pet_type}
                    onChange={(e) => setPetForm({ ...petForm, pet_type: e.target.value })}
                    placeholder="e.g. Dog, Cat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Status</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={petForm.status}
                    onChange={(e) => setPetForm({ ...petForm, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Breed</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={petForm.breed}
                  onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Color</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={petForm.color}
                  onChange={(e) => setPetForm({ ...petForm, color: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Pet Image</label>
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-xl border border-gray-200" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setPetForm({ ...petForm, image: file });
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                  {editingPet ? 'Update Pet' : 'Register Pet'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPetModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Admin Control Panel</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/profile'}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-bold text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>Profile</span>
              </button>
              {/* <button 
                onClick={() => { authService.logout(); window.location.href = '/login'; }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>Logout</span>
              </button> */}
            </div>
          </div>
        </header>
        <div className="p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'reports' && renderReports()}
                {activeTab === 'pets' && renderPets()}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
