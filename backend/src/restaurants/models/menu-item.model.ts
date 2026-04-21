import { ObjectType, Field } from '@nestjs/graphql';
import { Restaurant } from './restaurant.model';

@ObjectType()
export class MenuItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field()
  restaurantId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Restaurant)
  restaurant: Restaurant;
}
