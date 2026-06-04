import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { ChatRoom, Message, ShopOwnerProfile } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import DetailLayout from '../../../components/common/DetailLayout';

function AdminRescueDetail() {
  const { id } = useParams<{ id: string }>();
  const [rescue, setRescue] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.get(`/chats/rooms/${id}/`),
        api.get(`/chats/rooms/${id}/messages/`)
      ])
        .then(([rescueRes, msgRes]) => {
          const rescueData = rescueRes.data && typeof rescueRes.data === 'object' && 'success' in rescueRes.data 
            ? rescueRes.data.data 
            : rescueRes.data;
          setRescue(rescueData);
          setMessages(msgRes.data?.data || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Spinner message="Loading rescue details..." />;
  if (!rescue) return <div className="p-8 text-center text-red-500 font-bold">Rescue operation record not found</div>;

  const { report, reporter, rescuer } = rescue;
  const pet = report.pet;

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

  const getDisplayName = (user: any) => {
    if (user.profile && 'shop_name' in user.profile) {
      return (user.profile as ShopOwnerProfile).shop_name;
    }
    return `${user.first_name} ${user.last_name}`;
  };

  return (
    <DetailLayout
      title={`Rescue: ${pet?.name || 'Pet'}`}
      subtitle={`Operation ID: #${report.rescue_id}`}
      backLink="/admin/rescues"
      backText="Back to Rescues"
      image={pet?.image_url || undefined}
      stats={[
        { label: 'Report ID', value: report.rescue_id },
        { label: 'Type', value: report.report_type },
        { label: 'Location', value: report.location },
        { label: 'Status', value: rescue.is_completed ? 'Resolved 🎉' : 'Active ⏳' }
      ]}
    >
      <div className="space-y-12">
        {/* Parties involved */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Finder */}
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
                <p className="font-bold text-stone-900 text-lg">{getDisplayName(reporter)}</p>
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

          {/* Rescuer */}
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
                <p className="font-bold text-stone-900 text-lg">{getDisplayName(rescuer)}</p>
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

        {/* Pet details */}
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
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">🚨 Original Report</h3>
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

        <hr className="border-stone-100" />

        {/* Conversation Logs */}
        <section>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">💬 Chat Conversation History</h3>
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 h-80 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <p className="text-stone-400 text-sm italic text-center py-20">No messages exchanged in this operation yet.</p>
            ) : (
              messages.map(msg => {
                const isReporter = msg.sender === reporter.id;
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      isReporter 
                        ? 'bg-amber-50 text-stone-800 border border-amber-200/50 self-start'
                        : 'bg-emerald-50 text-stone-800 border border-emerald-200/50 self-end'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 mb-1">
                      <span className="font-black text-[10px] text-stone-500">
                        {isReporter ? ' Finder' : ' Rescuer'} • @{msg.sender_username}
                      </span>
                      <span className="text-[9px] text-stone-400 font-mono">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="break-words leading-relaxed">{msg.content}</p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </DetailLayout>
  );
}

export default AdminRescueDetail;
