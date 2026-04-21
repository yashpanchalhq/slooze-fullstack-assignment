import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderItem } from './models';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus, Country, Role } from '../common/enums';


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any): Promise<Order[]> {
    let where: any = {};
    
    // Non-admin users can only see orders from their country
    if (user.role !== Role.ADMIN) {
      where.country = user.country;
    }
    
    // Members can only see their own orders
    if (user.role === Role.MEMBER) {
      where.userId = user.id;
    }

    const results = await this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payment: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
    return results as unknown as Order[];
  }

  async findOne(id: string, user: any): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payment: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });

    if (!order) return null;

    // Check access permissions
    if (user.role !== Role.ADMIN) {
      // Country restriction
      if (order.country !== user.country) {
        return null;
      }
      
      // Member restriction - can only see own orders
      if (user.role === Role.MEMBER && order.userId !== user.id) {
        return null;
      }
    }

    return order as unknown as Order;
  }

  async createOrder(createOrderInput: CreateOrderInput, user: any): Promise<Order> {
    // Calculate total amount
    const menuItemIds = createOrderInput.orderItems.map(item => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      include: { restaurant: true },
    });

    // Check country access
    for (const item of menuItems) {
      if (user.role !== Role.ADMIN && item.restaurant.country !== user.country) {
        throw new ForbiddenException('Cannot order items from restaurants outside your country');
      }
    }

    let totalAmount = 0;
    const orderItemsData = createOrderInput.orderItems.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    const targetUserId = (user.role === Role.MEMBER || !createOrderInput.userId) 
      ? user.id 
      : createOrderInput.userId;

    const result = await this.prisma.order.create({
      data: {
        userId: targetUserId,
        totalAmount,
        country: user.country,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        // We include payment here even if null to match Order model requirements
        payment: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
    return result as unknown as Order;
  }

  async cancelOrder(id: string, user: any): Promise<Order> {
    const order = await this.findOne(id, user);
    
    if (!order) {
      throw new ForbiddenException('Order not found or access denied');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Cannot cancel order that is not pending');
    }

    // Members cannot cancel orders
    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    const result = await this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payment: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
    return result as unknown as Order;
  }

  async checkoutOrder(id: string, paymentMethodId: string, user: any): Promise<Order> {
    const order = await this.findOne(id, user);
    
    if (!order) {
      throw new ForbiddenException('Order not found or access denied');
    }

    // Members cannot checkout
    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot checkout orders');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Cannot checkout order that is not pending');
    }

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        orderId: id,
        paymentMethodId,
        amount: order.totalAmount,
        status: 'COMPLETED',
      },
    });

    // Update order status
    const result = await this.prisma.order.update({
      where: { id },
      data: { 
        status: OrderStatus.CONFIRMED,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payment: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
    return result as unknown as Order;
  }
}
