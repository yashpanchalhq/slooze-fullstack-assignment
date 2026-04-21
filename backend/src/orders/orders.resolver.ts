import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from './models';
import { CreateOrderInput } from './dto/create-order.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CountryGuard } from '../auth/country.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';


@Resolver(() => Order)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [Order])
  @UseGuards(JwtAuthGuard, CountryGuard)
  async orders(@CurrentUser() user: any): Promise<Order[]> {
    return this.ordersService.findAll(user);
  }

  @Query(() => Order, { nullable: true })
  @UseGuards(JwtAuthGuard, CountryGuard)
  async order(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Order | null> {
    return this.ordersService.findOne(id, user);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, CountryGuard)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: any,
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrderInput, user);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Order> {
    return this.ordersService.cancelOrder(id, user);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuard, CountryGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async checkoutOrder(
    @Args('id') id: string,
    @Args('paymentMethodId') paymentMethodId: string,
    @CurrentUser() user: any,
  ): Promise<Order> {
    return this.ordersService.checkoutOrder(id, paymentMethodId, user);
  }
}
