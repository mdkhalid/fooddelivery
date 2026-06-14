import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import api from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { OrderTracking, OrderStatus } from '@/types/order.types';

interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

interface TrackingState {
  tracking: OrderTracking | null;
  currentStatus: OrderStatus | null;
  driverLocation: DriverLocation | null;
  eta: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useOrderTracking(orderId: string) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<TrackingState>({
    tracking: null,
    currentStatus: null,
    driverLocation: null,
    eta: null,
    isLoading: true,
    error: null,
  });

  const { data: initialTracking, isLoading: isQueryLoading } = useQuery({
    queryKey: ['orderTracking', orderId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<OrderTracking>>(`/orders/${orderId}/tracking`);
      return data.data;
    },
    enabled: !!orderId,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!orderId) return;

    let pollInterval: ReturnType<typeof setTimeout> | null = null;
    let socketConnected = false;

    const socket = io(import.meta.env.VITE_WS_URL || window.location.origin, {
      auth: {
        token: localStorage.getItem('fooddelivery-auth')
          ? JSON.parse(localStorage.getItem('fooddelivery-auth')!).state.accessToken
          : null,
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socketConnected = true;
      socket.emit('track:order', { orderId });
    });

    socket.on('order:statusUpdate', (data: { status: OrderStatus; timestamp: string }) => {
      setState((prev) => ({
        ...prev,
        currentStatus: data.status,
        tracking: prev.tracking
          ? {
              ...prev.tracking,
              status: data.status,
              timeline: [
                ...prev.tracking.timeline,
                {
                  id: `timeline-${Date.now()}`,
                  orderId,
                  status: data.status,
                  description: `Order status updated to ${data.status}`,
                  timestamp: data.timestamp,
                },
              ],
            }
          : null,
      }));
      queryClient.invalidateQueries({ queryKey: ['orderTracking', orderId] });
    });

    socket.on('order:driverLocation', (data: DriverLocation) => {
      setState((prev) => ({
        ...prev,
        driverLocation: data,
      }));
    });

    socket.on('order:eta', (data: { eta: string }) => {
      setState((prev) => ({
        ...prev,
        eta: data.eta,
      }));
    });

    socket.on('connect_error', () => {
      if (!socketConnected) {
        startPolling();
      }
    });

    socket.on('disconnect', () => {
      if (!socketConnected) {
        startPolling();
      }
    });

    function startPolling() {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        try {
          const { data } = await api.get<ApiResponse<OrderTracking>>(`/orders/${orderId}/tracking`);
          const trackingData = data.data;
          setState((prev) => ({
            ...prev,
            tracking: trackingData,
            currentStatus: trackingData.status,
            driverLocation: trackingData.driverLocation ?? null,
            eta: trackingData.estimatedArrival ?? null,
          }));
        } catch {
          // Silently fail polling
        }
      }, 10000);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [orderId, queryClient]);

  useEffect(() => {
    if (initialTracking) {
      setState((prev) => ({
        ...prev,
        tracking: initialTracking,
        currentStatus: initialTracking.status,
        driverLocation: initialTracking.driverLocation ?? null,
        eta: initialTracking.estimatedArrival ?? null,
        isLoading: false,
      }));
    }
  }, [initialTracking]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoading: isQueryLoading,
    }));
  }, [isQueryLoading]);

  const reconnect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, []);

  return {
    ...state,
    reconnect,
  };
}
