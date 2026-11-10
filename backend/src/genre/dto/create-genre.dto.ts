import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    description: 'The name of the genre.',
    example: 'Action',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
