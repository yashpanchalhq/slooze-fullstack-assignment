import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role, Country } from '../../common/enums';


@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => Role)
  @IsEnum(Role)
  role: Role;

  @Field(() => Country)
  @IsEnum(Country)
  country: Country;
}
