import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    description: 'The price of the ticket.',
    example: 15.5,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'The seat identifier.',
    example: 'F12',
  })
  @IsString()
  @IsNotEmpty()
  seat: string;

  @ApiProperty({
    description: 'The UUID of the session this ticket is for.',
    example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
  })
  @IsUUID()
  sessionId: string;

  @ApiProperty({
    description: '(Optional) The UUID of the order this ticket belongs to.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  orderId?: string;
}
