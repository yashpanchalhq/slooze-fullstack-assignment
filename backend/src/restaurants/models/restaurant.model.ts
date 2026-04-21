import { ObjectType, Field } from '@nestjs/graphql';
import { Country } from '../../common/enums';

import { MenuItem } from './menu-item.model';

@ObjectType()
export class Restaurant {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Country)
  country: Country;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [MenuItem])
  menuItems: MenuItem[];
}
