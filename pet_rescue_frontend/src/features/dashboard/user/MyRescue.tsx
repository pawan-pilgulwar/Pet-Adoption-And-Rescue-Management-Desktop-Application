import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { ChatRoom, ShopOwnerProfile } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import SearchBar from '../../../components/common/SearchBar';
import DetailLayout from '../../../components/common/DetailLayout';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';

function MyRescue() {
  const { user } = useAuth();
  const { setIsOpen, setActiveRoomId } = useChat();

  const [rescues, setRescues] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/chats/rooms/')
      .then(res => {
        const roomsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setRescues(roomsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getOtherUser = (room: ChatRoom) => {
    if (!user) return room.reporter;
    return room.reporter.id === user.id ? room.rescuer : room.reporter;
  };

  const getRole = (room: ChatRoom) => {
    if (!user) return '—';
    return room.reporter.id === user.id ? 'Finder 📄' : 'Rescuer 🤝';
  };

  const filteredRescues = rescues.filter(r => {
    const other = getOtherUser(r);
    const petName = r.report?.pet?.name || '';
    const location = r.report?.location || '';
    const otherName = `${other.first_name} ${other.last_name}`;
    const query = searchTerm.toLowerCase();

    return (
      petName.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query) ||
      otherName.toLowerCase().includes(query) ||
      getRole(r).toLowerCase().includes(query)
    );
  });

  const selectedRescue = rescues.find(r => r.id === selectedRescueId);

  // Type guards for profiles
  const getPhone = (profile: any) => {
    if (profile && 'phone_number' in profile) {
      return profile.phone_number;
    }
    return '—';
  };

  const getAddress = (profile: any) => {
    if (profile) {
      if ('address' in profile) return profile.address;
      if ('shop_address' in profile) return profile.shop_address;
    }
    return '—';
  };

  const handleOpenChat = (roomId: number) => {
    setActiveRoomId(roomId);
    setIsOpen(true);
  };

  if (loading) return <Spinner message="Loading your rescues..." />;

  // Render Detail View
  if (selectedRescue) {
    const { report, reporter, rescuer } = selectedRescue;
    const pet = report.pet;
    const otherUser = getOtherUser(selectedRescue);
    const myRole = getRole(selectedRescue);

    return (
      <div className="fade-in">
        <DetailLayout
          title={`Rescue Operation: ${pet?.name || 'Pet'}`}
          subtitle={`Rescue ID: ${report.rescue_id} • Status: ${report.status}`}
          backText="Back to Rescues"
          onBack={() => setSelectedRescueId(null)}
          image={pet?.image_url || undefined}
          stats={[
            { label: 'Role', value: myRole },
            { label: 'Report Type', value: report.report_type },
            { label: 'Location', value: report.location },
            { label: 'Operation Status', value: selectedRescue.is_completed ? 'Resolved 🎉' : 'In Progress ⏳' }
          ]}
        >
          <div className="space-y-12">
            {/* Quick Action: Open Chat */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-extrabold text-emerald-950 text-base">Live Collaboration Chat Room</h4>
                <p className="text-emerald-700 text-xs mt-1">Chat live with {otherUser.first_name} to coordinate the rescue operation.</p>
              </div>
              <Button 
                onClick={() => handleOpenChat(selectedRescue.id)}
                className="bg-emerald-500 hover:bg-emerald-600 border-none text-white font-bold"
              >
                💬 Open Chat Panel
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Reporter Info */}
              <section className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  📄 Finder / Reporter Details
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
                    {reporter.profile?.profile_picture_url ? (
                      <img src={reporter.profile.profile_picture_url} alt={reporter.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase bg-stone-50">
                        {reporter.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-lg">
                      {reporter.profile && 'shop_name' in reporter.profile 
                        ? (reporter.profile as ShopOwnerProfile).shop_name 
                        : `${reporter.first_name} ${reporter.last_name}`}
                    </p>
                    <p className="text-stone-500 text-sm">@{reporter.username} • {reporter.role}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-stone-50 pb-2">
                    <span className="text-stone-500">Contact Person</span>
                    <span className="font-semibold text-stone-900">{reporter.first_name} {reporter.last_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-50 pb-2">
                    <span className="text-stone-500">Email</span>
                    <span className="font-semibold text-stone-900">{reporter.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-50 pb-2">
                    <span className="text-stone-500">Phone</span>
                    <span className="font-semibold text-stone-900">{getPhone(reporter.profile)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Address</span>
                    <span className="font-semibold text-stone-900 text-right max-w-[200px]">{getAddress(reporter.profile)}</span>
                  </div>
                </div>
              </section>

              {/* Rescuer Info */}
              <section className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  🤝 Helper / Rescuer Details
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
                    {rescuer.profile?.profile_picture_url ? (
                      <img src={rescuer.profile.profile_picture_url} alt={rescuer.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xl uppercase bg-stone-50">
                        {rescuer.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-lg">
                      {rescuer.profile && 'shop_name' in rescuer.profile 
                        ? (rescuer.profile as ShopOwnerProfile).shop_name 
                        : `${rescuer.first_name} ${rescuer.last_name}`}
                    </p>
                    <p className="text-stone-500 text-sm">@{rescuer.username} • {rescuer.role}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-stone-50 pb-2">
                    <span className="text-stone-500">Contact Person</span>
                    <span className="font-semibold text-stone-900">{rescuer.first_name} {rescuer.last_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-50 pb-2">
                    <span className="text-stone-500">Email</span>
                    <span className="font-semibold text-stone-900">{rescuer.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-50 pb-2">
                    <span className="text-stone-500">Phone</span>
                    <span className="font-semibold text-stone-900">{getPhone(rescuer.profile)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Address</span>
                    <span className="font-semibold text-stone-900 text-right max-w-[200px]">{getAddress(rescuer.profile)}</span>
                  </div>
                </div>
              </section>
            </div>

            <hr className="border-stone-100" />

            {/* Pet Details */}
            {pet && (
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">🐾 Pet Information</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 font-mono">
                    {pet.pet_id}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Species</p>
                    <p className="font-semibold text-stone-900">{pet.species}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Breed</p>
                    <p className="font-semibold text-stone-900">{pet.breed || '—'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Gender</p>
                    <p className="font-semibold text-stone-900">{pet.gender || '—'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <p className="text-[10px] text-stone-400 uppercase font-bold mb-1">Color</p>
                    <p className="font-semibold text-stone-900">{pet.color || '—'}</p>
                  </div>
                </div>
                {pet.description && (
                  <div className="mt-6 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                    <p className="text-xs text-stone-400 uppercase font-bold mb-2 tracking-wider">Description</p>
                    <p className="text-stone-700 leading-relaxed italic">
                      "{pet.description}"
                    </p>
                  </div>
                )}
              </section>
            )}

            <hr className="border-stone-100" />

            {/* Report Details */}
            <section>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">🚨 Report Information</h3>
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-stone-400 font-medium">Location reported:</span>
                    <p className="font-semibold text-stone-800 mt-1">📍 {report.location}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Reported date:</span>
                    <p className="font-semibold text-stone-800 mt-1">📅 {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {report.description && (
                  <div className="pt-4 border-t border-stone-200/50">
                    <span className="text-stone-400 font-medium text-xs uppercase block mb-1">Report Description</span>
                    <p className="text-stone-700 leading-relaxed italic">"{report.description}"</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </DetailLayout>
      </div>
    );
  }

  // Render List View
  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">My Rescues</h1>
        <p className="text-stone-500">Track and manage your joint rescue operations.</p>
      </div>

      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Search by pet name, location, partner name, or role..." 
      />

      {filteredRescues.length === 0 ? (
        <div className="card">
          <Empty message={searchTerm ? "No rescues match your search." : "You don't have any rescue operations recorded yet."} />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Report ID</th>
                <th>Role</th>
                <th>Rescue Partner</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRescues.map(rescue => {
                const other = getOtherUser(rescue);
                const role = getRole(rescue);
                const pet = rescue.report.pet;
                
                return (
                  <tr key={rescue.id}>
                    <td className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                        {pet?.image_url ? (
                          <img src={pet.image_url} alt="Pet" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full w-full text-lg bg-stone-50 border border-stone-100 rounded-lg">🐾</span>
                        )}
                      </div>
                      <span className="font-semibold text-stone-900">{pet?.name || 'Unknown'}</span>
                    </td>
                    <td className="font-mono text-xs text-stone-500 font-bold">#{rescue.report.rescue_id}</td>
                    <td>
                      <span className={`badge text-[10px] ${role.includes('Finder') ? 'badge-blue' : 'badge-green'}`}>
                        {role}
                      </span>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-stone-900">
                        {other.profile && 'shop_name' in other.profile 
                          ? (other.profile as ShopOwnerProfile).shop_name 
                          : `${other.first_name} ${other.last_name}`}
                      </p>
                      <p className="text-[10px] text-stone-400">@{other.username}</p>
                    </td>
                    <td className="text-sm text-stone-500 truncate max-w-[150px]">📍 {rescue.report.location}</td>
                    <td>
                      <span className={`badge text-[10px] ${rescue.is_completed ? 'badge-green' : 'badge-yellow'}`}>
                        {rescue.is_completed ? 'Resolved' : 'Active'}
                      </span>
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => setSelectedRescueId(rescue.id)}
                        className="text-brand-500 hover:text-brand-600 font-bold text-xs uppercase tracking-wider bg-transparent border-none cursor-pointer"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyRescue;
