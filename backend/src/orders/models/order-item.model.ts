import { ObjectType, Field } from '@nestjs/graphql';
import { MenuItem } from '../../restaurants/models/menu-item.model';

@ObjectType()
export class OrderItem {
  @Field()
  id: string;

  @Field()
  orderId: string;

  @Field()
  menuItemId: string;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field(() => MenuItem)
  menuItem: MenuItem;
}
