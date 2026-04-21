import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Admin';
    case 'MANAGER':
      return 'Manager';
    case 'MEMBER':
      return 'Member';
    default:
      return role;
  }
}

export function getCountryDisplayName(country: string): string {
  switch (country) {
    case 'INDIA':
      return 'India';
    case 'AMERICA':
      return 'America';
    default:
      return country;
  }
}

export function getOrderStatusDisplay(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status;
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-100';
    case 'CONFIRMED':
      return 'text-green-600 bg-green-100';
    case 'CANCELLED':
      return 'text-red-600 bg-red-100';
    case 'COMPLETED':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}
