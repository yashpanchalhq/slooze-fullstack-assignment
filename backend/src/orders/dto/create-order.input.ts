import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateOrderInput {
  @Field()
  @IsString()
  @IsOptional()
  userId: string;

  @Field(() => [CreateOrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemInput)
  orderItems: CreateOrderItemInput[];
}

@InputType()
export class CreateOrderItemInput {
  @Field()
  @IsString()
  menuItemId: string;

  @Field()
  @IsNumber()
  @Min(1)
  quantity: number;
}
