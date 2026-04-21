import { ObjectType, Field } from '@nestjs/graphql';
import { Role, Country } from '../../common/enums';


@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Country)
  country: Country;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
