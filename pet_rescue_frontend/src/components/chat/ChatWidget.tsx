import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { ChatRoom, Message } from '../../types';

export default function ChatWidget() {
  const { user } = useAuth();
  const {
    isOpen,
    setIsOpen,
    rooms,
    activeRoomId,
    activeRoom,
    messages,
    unreadCount,
    loadingRooms,
    loadingMessages,
    setActiveRoomId,
    sendMessage,
    markCompleted
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Don't show anything for anonymous or admin users
  if (!user || user.role === 'ADMIN') return null;

  // Find the other participant in a chat room
  const getOtherUser = (room: ChatRoom) => {
    return room.reporter.id === user.id ? room.rescuer : room.reporter;
  };

  // Helper to format date nicely
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRoomId) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendMessage(msg);
  };

  // Filter rooms based on searched user name or pet name
  const filteredRooms = rooms.filter(room => {
    const other = getOtherUser(room);
    const fullName = `${other.first_name} ${other.last_name}`.toLowerCase();
    const petName = (room.report?.pet?.name || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || petName.includes(query) || other.username.toLowerCase().includes(query);
  });

  // Safe active room participant calculations
  const activeOtherUser = activeRoom ? getOtherUser(activeRoom) : null;
  const isActiveOtherOnline = activeRoom && activeOtherUser
    ? (activeRoom.reporter.id === activeOtherUser.id ? activeRoom.reporter_online : activeRoom.rescuer_online)
    : false;

  return (
    <>
      {/* ─── Floating Chat Icon ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none"
        title="Rescue Chat Center"
      >
        <span className="text-3xl">💬</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-6 w-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ─── WhatsApp-style Chat Panel ─── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[850px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-stone-50 border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex fade-in">
          
          {/* Sidebar (List of chats) */}
          <div className="w-[320px] bg-white border-r border-stone-100 flex flex-col h-full shrink-0">
            {/* Sidebar Header */}
            <div className="p-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-stone-800 text-lg">Rescue Chats</h3>
                <p className="text-xs text-stone-400">Live rescue coordination</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1 hover:bg-stone-200 rounded-full h-8 w-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Chat Search */}
            <div className="p-3 bg-white border-b border-stone-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-50">
              {loadingRooms && rooms.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-sm">Loading chats...</div>
              ) : filteredRooms.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-sm italic">
                  {searchTerm ? "No results found" : "No rescue chats active. Click 'Offer Help' on a rescue post to begin!"}
                </div>
              ) : (
                filteredRooms.map(room => {
                  const other = getOtherUser(room);
                  const isOtherOnline = room.reporter.id === other.id ? room.reporter_online : room.rescuer_online;
                  const isActive = room.id === activeRoomId;
                  
                  return (
                    <div
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`p-4 flex gap-3 cursor-pointer transition-colors duration-200 hover:bg-stone-50/80 ${isActive ? 'bg-emerald-50/50 hover:bg-emerald-50/60' : ''}`}
                    >
                      {/* Avatar */}
                      <div className="relative w-12 h-12 shrink-0">
                        <div className="w-full h-full rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center">
                          {other.profile?.profile_picture_url ? (
                            <img src={other.profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-stone-400 text-lg font-bold uppercase">{other.username.charAt(0)}</span>
                          )}
                        </div>
                        {/* Real-time online/offline presence indicator dot */}
                        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${isOtherOnline ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
                      </div>

                      {/* Info & Last Msg */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="font-bold text-stone-800 text-sm truncate">{other.first_name} {other.last_name}</p>
                          <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                            {room.latest_message ? formatTime(room.latest_message.created_at) : ''}
                          </span>
                        </div>
                        
                        <p className="text-[11px] font-bold text-amber-600 mb-1 flex items-center gap-1">
                          🐾 {room.report?.pet?.name || 'Unknown'} ({room.report?.report_type})
                        </p>
                        
                        <p className="text-xs text-stone-500 truncate">
                          {room.latest_message ? room.latest_message.content : 'No messages yet.'}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col items-end justify-between shrink-0">
                        {room.is_completed ? (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold">Resolved</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full font-bold">In Progress</span>
                        )}

                        {room.unread_count > 0 && (
                          <span className="h-5 min-w-[20px] px-1 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                            {room.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Conversation Panel */}
          <div className="flex-1 flex flex-col bg-emerald-50/30 relative h-full">
            {activeRoom && activeOtherUser ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between shadow-sm z-10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                      {activeOtherUser.profile?.profile_picture_url ? (
                        <img src={activeOtherUser.profile.profile_picture_url || undefined} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-stone-400 font-bold text-sm uppercase">{activeOtherUser.username.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-extrabold text-stone-800 text-sm">
                          {activeOtherUser.first_name} {activeOtherUser.last_name}
                        </p>
                        <span className={`h-2 w-2 rounded-full ${
                          isActiveOtherOnline ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'
                        }`} />
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                          {isActiveOtherOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-medium">
                        Report ID: <span className="font-mono text-stone-600 font-semibold">#{activeRoom.report.rescue_id}</span> • 📍 {activeRoom.report.location}
                      </p>
                    </div>
                  </div>

                  {/* Top Action / Mark complete */}
                  {!activeRoom.is_completed && (
                    <button
                      onClick={markCompleted}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-200 shadow-sm ${
                        (activeRoom.reporter.id === user.id && activeRoom.reporter_marked_completed) ||
                        (activeRoom.rescuer.id === user.id && activeRoom.rescuer_marked_completed)
                          ? 'bg-amber-50 border-amber-200 text-amber-600 cursor-default'
                          : 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600 hover:scale-105 active:scale-95'
                      }`}
                      disabled={
                        (activeRoom.reporter.id === user.id && activeRoom.reporter_marked_completed) ||
                        (activeRoom.rescuer.id === user.id && activeRoom.rescuer_marked_completed)
                      }
                    >
                      { (activeRoom.reporter.id === user.id && activeRoom.reporter_marked_completed) ||
                        (activeRoom.rescuer.id === user.id && activeRoom.rescuer_marked_completed)
                          ? '⏳ Waiting for other user...'
                          : '🤝 Mark Rescue Completed'
                      }
                    </button>
                  )}
                </div>

                {/* completion Banner or status warnings */}
                {activeRoom.is_completed && (
                  <div className="bg-emerald-500 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-sm">
                    🎉 Rescue Operation Completed! The report status has been updated to Resolved.
                  </div>
                )}

                {/* Waiting warning banner */}
                {!activeRoom.is_completed && (
                  (activeRoom.reporter_marked_completed && !activeRoom.rescuer_marked_completed) ||
                  (!activeRoom.reporter_marked_completed && activeRoom.rescuer_marked_completed)
                ) && (
                  <div className="bg-amber-500 text-white py-1.5 px-4 text-center text-[11px] font-semibold shrink-0">
                    ⚠️ {activeRoom.reporter_marked_completed 
                      ? 'The Finder has marked this rescue as complete! Waiting for Rescuer to click.' 
                      : 'The Rescuer has marked this rescue as complete! Waiting for Finder to click.'
                    }
                  </div>
                )}

                {/* Messages List Area */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                >
                  {loadingMessages && messages.length === 0 ? (
                    <div className="m-auto text-stone-400 text-sm">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="m-auto text-stone-400 text-xs italic bg-white/80 border border-stone-200/50 px-4 py-3 rounded-2xl max-w-xs text-center shadow-sm">
                      Send a message to introduce yourself and coordinate the rescue! 🐾
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMe = msg.sender === user.id;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group flex flex-col ${
                            isMe
                              ? 'bg-emerald-500 text-white rounded-tr-none self-end'
                              : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none self-start'
                          }`}
                        >
                          <p className="break-words pr-8 leading-snug">{msg.content}</p>
                          <span className={`text-[9px] mt-1 font-medium font-mono text-right self-end ${isMe ? 'text-emerald-100' : 'text-stone-400'}`}>
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Typing Bar */}
                <div className="p-3 bg-white border-t border-stone-100 z-10 shrink-0">
                  {activeRoom.is_completed ? (
                    <div className="bg-stone-50 border border-stone-200 text-stone-400 text-center py-3 rounded-2xl text-xs font-bold italic select-none">
                      🔒 Rescue completed. New messages are disabled.
                    </div>
                  ) : (
                    <form onSubmit={handleSend} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-all font-bold text-lg shadow-sm"
                      >
                        ➔
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="m-auto flex flex-col items-center gap-4 text-center max-w-sm p-8 fade-in">
                <span className="text-6xl animate-bounce">🐾</span>
                <h3 className="font-extrabold text-stone-700 text-lg">Rescue Portal Chat Room</h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Select a contact from the sidebar list, or click <strong className="text-brand-500">"Offer Help / Send Message"</strong> on any verified rescue report to coordinate a live pet rescue.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
