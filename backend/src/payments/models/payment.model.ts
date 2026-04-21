import { ObjectType, Field } from '@nestjs/graphql';
import { PaymentStatus } from '../../common/enums';

import { PaymentMethod } from './payment-method.model';

@ObjectType()
export class Payment {
  @Field()
  id: string;

  @Field()
  orderId: string;

  @Field()
  paymentMethodId: string;

  @Field()
  amount: number;

  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}
