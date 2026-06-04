import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { ChatRoom, Message } from '../types';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  rooms: ChatRoom[];
  activeRoomId: number | null;
  activeRoom: ChatRoom | null;
  messages: Message[];
  unreadCount: number;
  loadingRooms: boolean;
  loadingMessages: boolean;
  setActiveRoomId: (id: number | null) => void;
  initiateChat: (reportId: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  markCompleted: () => Promise<void>;
  refreshRooms: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat(): ChatContextType {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used inside ChatProvider');
  }
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const activeRoomIdRef = useRef<number | null>(null);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  const activeRoom = rooms.find(r => r.id === activeRoomId) || null;

  // Calculate total unread messages count
  const unreadCount = rooms.reduce((acc, room) => acc + (room.unread_count || 0), 0);

  // Fetch all chat rooms
  async function refreshRooms() {
    if (!user || user.role === 'ADMIN') return;
    setLoadingRooms(true);
    try {
      const res = await api.get('/chats/rooms/');
      const roomsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setRooms(roomsData);
    } catch (err) {
      console.error('Failed to fetch chat rooms', err);
    } finally {
      setLoadingRooms(false);
    }
  }

  // Initiate chat for a specific report (from the rescue detail page)
  async function initiateChat(reportId: number) {
    if (!user || user.role === 'ADMIN') return;
    try {
      const res = await api.post('/chats/rooms/initiate/', { report_id: reportId });
      const room: ChatRoom = res.data?.data;
      if (room) {
        // Optimistically update rooms state instantly so activeRoom is evaluated to true
        setRooms(prev => {
          if (prev.some(r => r.id === room.id)) return prev;
          return [room, ...prev];
        });
        setActiveRoomId(room.id);
        setIsOpen(true);
        // Refresh rooms in background
        refreshRooms();
      }
    } catch (err) {
      console.error('Failed to initiate chat', err);
    }
  }

  // Send message
  async function sendMessage(content: string) {
    if (!activeRoomId || !user) return;

    // Attempt real-time socket emit
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', { room_id: activeRoomId, content }, (res: any) => {
        if (res && res.status === 'error') {
          console.error('Socket message send error:', res.message);
        }
      });
    } else {
      // REST Fallback
      try {
        const res = await api.post(`/chats/rooms/${activeRoomId}/send/`, { content });
        const newMsg: Message = res.data?.data;
        if (newMsg) {
          setMessages(prev => [...prev, newMsg]);
          // Refresh room list to show updated latest message
          refreshRooms();
        }
      } catch (err) {
        console.error('REST send message fallback failed', err);
      }
    }
  }

  // Mark rescue completed
  async function markCompleted() {
    if (!activeRoomId) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('mark_completed', { room_id: activeRoomId }, (res: any) => {
        if (res && res.status === 'error') {
          console.error('Socket mark completed error:', res.message);
        }
      });
    } else {
      // REST Fallback
      try {
        const res = await api.post(`/chats/rooms/${activeRoomId}/complete/`);
        const updatedRoom: ChatRoom = res.data?.data;
        if (updatedRoom) {
          setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
          refreshRooms();
        }
      } catch (err) {
        console.error('REST mark completed fallback failed', err);
      }
    }
  }

  // Fetch messages when active room changes
  useEffect(() => {
    if (!activeRoomId || !user || user.role === 'ADMIN') {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    api.get(`/chats/rooms/${activeRoomId}/messages/`)
      .then(res => {
        setMessages(res.data?.data || []);
        // Mark room as read locally
        setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, unread_count: 0 } : r));
      })
      .catch(err => console.error('Failed to load messages', err))
      .finally(() => setLoadingMessages(false));

    // Join room in Socket.IO
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', { room_id: activeRoomId });
    }
  }, [activeRoomId, user]);

  // Handle Socket.IO connection and lifecycle
  useEffect(() => {
    if (!user || user.role === 'ADMIN') {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setRooms([]);
      setActiveRoomId(null);
      return;
    }

    // Initialize Socket.IO connection
    refreshRooms();

    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.IO connected');
      // If we already had an active room, join its channel
      if (activeRoomIdRef.current) {
        socket.emit('join_room', { room_id: activeRoomIdRef.current });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socket.on('new_message', (msg: Message) => {
      // If it belongs to our active room, append it
      if (msg.room === activeRoomIdRef.current) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // Mark as read immediately on backend
        api.get(`/chats/rooms/${activeRoomIdRef.current}/messages/`).catch(() => { });
      }

      // Update room list
      refreshRooms();
    });

    socket.on('room_updated', (updatedRoom: ChatRoom) => {
      setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
      refreshRooms();
    });

    socket.on('user_status', ({ user_id, status }: { user_id: number; status: 'online' | 'offline' }) => {
      setRooms(prev => prev.map(room => {
        let updated = false;
        const newRoom = { ...room };
        if (newRoom.reporter.id === user_id) {
          newRoom.reporter_online = (status === 'online');
          updated = true;
        }
        if (newRoom.rescuer.id === user_id) {
          newRoom.rescuer_online = (status === 'online');
          updated = true;
        }
        return updated ? newRoom : room;
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Keep joining Socket.IO rooms on room changes if socket connects late
  useEffect(() => {
    if (socketRef.current?.connected && activeRoomId) {
      socketRef.current.emit('join_room', { room_id: activeRoomId });
    }
  }, [activeRoomId, socketRef.current?.connected]);

  return (
    <ChatContext.Provider
      value={{
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
        initiateChat,
        sendMessage,
        markCompleted,
        refreshRooms
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
