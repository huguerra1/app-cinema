import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    description: 'The start time of the session in ISO 8601 format.',
    example: '2026-04-01T20:00:00.000Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'The UUID of the movie for this session.',
    example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
  })
  @IsUUID()
  movieId: string;

  @ApiProperty({
    description: 'The UUID of the room for this session.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  roomId: string;
}
