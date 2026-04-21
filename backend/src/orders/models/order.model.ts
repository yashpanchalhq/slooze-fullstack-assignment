import { ObjectType, Field } from '@nestjs/graphql';
import { OrderStatus, Country } from '../../common/enums';

import { OrderItem } from './order-item.model';
import { Payment } from '../../payments/models/payment.model';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field()
  totalAmount: number;

  @Field(() => Country)
  country: Country;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field(() => Payment, { nullable: true })
  payment?: Payment;
}
