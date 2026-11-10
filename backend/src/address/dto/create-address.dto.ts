import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street!: string;

  @IsInt()
  @Min(0)
  @Max(2147483647)
  number!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode!: string;

  @ApiProperty({
    description: 'ID legado opcional; deve corresponder ao token.',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
