import { ExpirationStatus } from '@/types';
import { differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

export const getExpirationStatus = (expirationDate: Date): ExpirationStatus => {
  const today = startOfDay(new Date());
  const expDate = startOfDay(expirationDate);
  
  if (isBefore(expDate, today)) {
    return 'expired';
  }
  
  const daysUntilExpiration = differenceInDays(expDate, today);
  
  if (daysUntilExpiration <= 7) {
    return 'expiring';
  }
  
  return 'fresh';
};

export const getDaysUntilExpiration = (expirationDate: Date): number => {
  const today = startOfDay(new Date());
  const expDate = startOfDay(expirationDate);
  return differenceInDays(expDate, today);
};

export const getStatusLabel = (status: ExpirationStatus): string => {
  switch (status) {
    case 'expired':
      return 'Vencido';
    case 'expiring':
      return 'Vence em breve';
    case 'fresh':
      return 'OK';
  }
};

export const getStatusColor = (status: ExpirationStatus): string => {
  switch (status) {
    case 'expired':
      return 'status-expired';
    case 'expiring':
      return 'status-expiring';
    case 'fresh':
      return 'status-fresh';
  }
};
