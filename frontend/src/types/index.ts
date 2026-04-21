export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export enum Country {
  INDIA = 'INDIA',
  AMERICA = 'AMERICA',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  country: Country;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  country: Country;
  createdAt: string;
  updatedAt: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  restaurant: Restaurant;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  country: Country;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem: MenuItem;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  lastFour: string;
  provider: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethodId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  paymentMethod: PaymentMethod;
}

export interface AuthContext {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: SignUpData) => Promise<void>;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: Role;
  country: Country;
}
