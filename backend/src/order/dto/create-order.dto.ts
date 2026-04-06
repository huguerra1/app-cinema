import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SnackComboOrderDto } from './snack-combo-order.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The UUID of the user placing the order.',
    example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'An array of ticket UUIDs to be included in the order.',
    example: [
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    ],
    required: false,
    type: [String],
  })
  @IsUUID('4', { each: true })
  @IsArray()
  @IsOptional()
  ticketIds?: string[];

  @ApiProperty({
    description:
      'An array of objects, each with a snackComboId and quantity.',
    required: false,
    type: [SnackComboOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SnackComboOrderDto)
  @IsOptional()
  snackCombos?: SnackComboOrderDto[];
}

