import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentMethod, Payment } from './models';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CountryGuard } from '../auth/country.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';


@Resolver(() => PaymentMethod)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query(() => [PaymentMethod])
  @UseGuards(JwtAuthGuard, CountryGuard)
  async paymentMethods(@CurrentUser() user: any): Promise<PaymentMethod[]> {
    return this.paymentsService.findPaymentMethods(user);
  }

  @Query(() => PaymentMethod, { nullable: true })
  @UseGuards(JwtAuthGuard, CountryGuard)
  async paymentMethod(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PaymentMethod | null> {
    return this.paymentsService.findPaymentMethod(id, user);
  }

  @Query(() => [Payment])
  @UseGuards(JwtAuthGuard, CountryGuard)
  async payments(@CurrentUser() user: any): Promise<Payment[]> {
    return this.paymentsService.findPayments(user);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN)
  async createPaymentMethod(
    @Args('createPaymentMethodInput') createPaymentMethodInput: CreatePaymentMethodInput,
    @CurrentUser() user: any,
  ): Promise<PaymentMethod> {
    return this.paymentsService.createPaymentMethod(createPaymentMethodInput, user);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('updateData') updateData: UpdatePaymentMethodInput,
    @CurrentUser() user: any,
  ): Promise<PaymentMethod> {
    return this.paymentsService.updatePaymentMethod(id, updateData, user);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN)
  async deletePaymentMethod(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<PaymentMethod> {
    return this.paymentsService.deletePaymentMethod(id, user);
  }
}
