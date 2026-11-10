import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAddressDto {
  @IsString() @IsNotEmpty() street!: string;
  @IsInt() number!: number;
  @IsString() @IsNotEmpty() city!: string;
  @IsString() @IsNotEmpty() state!: string;
  @IsString() @IsNotEmpty() zipCode!: string;

  @ApiProperty({
    description: 'ID legado opcional; deve corresponder ao token.',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
