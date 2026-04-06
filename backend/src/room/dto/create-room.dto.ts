import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: 'The name of the room.',
    example: 'Room 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The seating capacity of the room.',
    example: 100,
  })
  @IsInt()
  @IsPositive()
  capacity: number;
}
