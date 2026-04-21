import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean } from 'class-validator';

@InputType()
export class CreatePaymentMethodInput {
  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  lastFour: string;

  @Field()
  @IsString()
  provider: string;

  @Field({ nullable: true })
  @IsBoolean()
  isDefault?: boolean;
}
