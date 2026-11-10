import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: 'The name of the room.',
    example: 'Room 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The seating capacity of the room.',
    example: 100,
  })
  @IsInt()
  @Min(1)
  @Max(2147483647)
  capacity: number;
}
