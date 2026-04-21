import { ObjectType, Field } from '@nestjs/graphql';
import { Payment } from './payment.model';

@ObjectType()
export class PaymentMethod {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field()
  lastFour: string;

  @Field()
  provider: string;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Payment])
  payments: Payment[];
}
