import { useEffect, useRef, useCallback, useState } from 'react';
import { WS_URL } from '../utils/constants';
import { storageUtils, StorageKeys } from '../utils/storage';
import { useOrderStore } from '../stores/orderStore';

export const useWebSocket = () => {
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { addAvailableOrder, removeAvailableOrder } = useOrderStore();

  const connect = useCallback(() => {
    const token = storageUtils.getString(StorageKeys.AUTH_TOKEN);
    if (!token) return;
    try {
      const io = require('socket.io-client');
      socketRef.current = io(WS_URL, { auth: { token }, transports: ['websocket'] });
      socketRef.current.on('connect', () => setIsConnected(true));
      socketRef.current.on('disconnect', () => setIsConnected(false));
      socketRef.current.on('order:assigned', (order: any) => addAvailableOrder(order));
      socketRef.current.on('order:removed', (data: any) => removeAvailableOrder(data.orderId));
    } catch (e) {
      console.log('Socket.io not available');
    }
  }, [addAvailableOrder, removeAvailableOrder]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { isConnected, emit };
};
