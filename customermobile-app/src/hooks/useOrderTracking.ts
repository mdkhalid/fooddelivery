import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';
import { mmkvStorage, StorageKeys } from '../utils/storage';
import { OrderTracking } from '../types/order.types';

export const useOrderTracking = (orderId: string) => {
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = mmkvStorage.getString(StorageKeys.AUTH_TOKEN);
    
    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join:order', { orderId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('order:tracking', (data: OrderTracking) => {
      setTracking(data);
    });

    socket.on('order:status', (data: { status: string; timestamp: string }) => {
      setTracking((prev) =>
        prev
          ? {
              ...prev,
              status: data.status as OrderTracking['status'],
              lastUpdated: data.timestamp,
            }
          : null
      );
    });

    socket.on('driver:location', (data: { latitude: number; longitude: number; bearing?: number }) => {
      setTracking((prev) =>
        prev
          ? {
              ...prev,
              driverLocation: data,
              lastUpdated: new Date().toISOString(),
            }
          : null
      );
    });

    return () => {
      socket.emit('leave:order', { orderId });
      socket.disconnect();
    };
  }, [orderId]);

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('order:message', { orderId, message });
    }
  };

  return {
    tracking,
    isConnected,
    sendMessage,
  };
};
