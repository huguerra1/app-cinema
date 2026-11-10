import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Allow,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Campo legado ignorado; o servidor usa o preço da sessão.',
    example: 15.5,
    required: false,
  })
  @Allow()
  price?: unknown;

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
