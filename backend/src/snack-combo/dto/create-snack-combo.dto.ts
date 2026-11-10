import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSnackComboDto {
  @ApiProperty({
    description: 'The name of the snack combo.',
    example: 'Large Popcorn + Soda',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The price of the snack combo.',
    example: 12.99,
  })
  @IsNumber()
  @IsPositive()
  price: number;
}
