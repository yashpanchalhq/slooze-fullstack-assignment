import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod, Payment } from './models';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { Role } from '../common/enums';


@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findPaymentMethods(user: any): Promise<PaymentMethod[]> {
    let where: any = {};
    
    // Non-admin users can only see their own payment methods
    if (user.role !== Role.ADMIN) {
      where.userId = user.id;
    }

    const results = await this.prisma.paymentMethod.findMany({
      where,
      include: {
        payments: {
          include: { paymentMethod: true },
        },
      },
    });
    return results as unknown as PaymentMethod[];
  }

  async findPaymentMethod(id: string, user: any): Promise<PaymentMethod | null> {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
      include: {
        payments: {
          include: { paymentMethod: true },
        },
      },
    });

    if (!paymentMethod) return null;

    // Check access permissions
    if (user.role !== Role.ADMIN && paymentMethod.userId !== user.id) {
      return null;
    }

    return paymentMethod as unknown as PaymentMethod;
  }

  async createPaymentMethod(
    createPaymentMethodInput: CreatePaymentMethodInput,
    user: any,
  ): Promise<PaymentMethod> {
    // Only admins can create payment methods
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create payment methods');
    }

    // If setting as default, unset other default payment methods for the user
    if (createPaymentMethodInput.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const result = await this.prisma.paymentMethod.create({
      data: {
        ...createPaymentMethodInput,
        userId: user.id,
      },
      include: {
        payments: {
          include: { paymentMethod: true },
        },
      },
    });
    return result as unknown as PaymentMethod;
  }

  async updatePaymentMethod(
    id: string,
    updateData: Partial<CreatePaymentMethodInput>,
    user: any,
  ): Promise<PaymentMethod> {
    // Only admins can update payment methods
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update payment methods');
    }

    const paymentMethod = await this.findPaymentMethod(id, user);
    if (!paymentMethod) {
      throw new ForbiddenException('Payment method not found or access denied');
    }

    // If setting as default, unset other default payment methods for the user
    if (updateData.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { 
          userId: paymentMethod.userId,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const result = await this.prisma.paymentMethod.update({
      where: { id },
      data: updateData,
      include: {
        payments: {
          include: { paymentMethod: true },
        },
      },
    });
    return result as unknown as PaymentMethod;
  }

  async deletePaymentMethod(id: string, user: any): Promise<PaymentMethod> {
    // Only admins can delete payment methods
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete payment methods');
    }

    const paymentMethod = await this.findPaymentMethod(id, user);
    if (!paymentMethod) {
      throw new ForbiddenException('Payment method not found or access denied');
    }

    // Check if payment method is being used
    const activePayments = await this.prisma.payment.findFirst({
      where: {
        paymentMethodId: id,
        status: 'COMPLETED',
      },
    });

    if (activePayments) {
      throw new ForbiddenException('Cannot delete payment method that is being used');
    }

    const result = await this.prisma.paymentMethod.delete({
      where: { id },
      include: {
        payments: {
          include: { paymentMethod: true },
        },
      },
    });
    return result as unknown as PaymentMethod;
  }

  async findPayments(user: any): Promise<Payment[]> {
    let where: any = {};
    
    // Non-admin users can only see payments from their country
    if (user.role !== Role.ADMIN) {
      where.order = {
        country: user.country,
      };
    }

    const results = await this.prisma.payment.findMany({
      where,
      include: {
        paymentMethod: true,
        order: true,
      },
    });
    return results as unknown as Payment[];
  }
}
