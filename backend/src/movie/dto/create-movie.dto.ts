import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The title of the movie.',
    example: 'The Matrix',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'The duration of the movie in minutes.',
    example: 136,
  })
  @IsInt()
  @Min(1)
  @Max(2147483647)
  durationMinutes: number;

  @ApiProperty({
    description: 'A brief synopsis of the movie.',
    example:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  synopsis: string;

  @ApiProperty({
    description: 'The UUID of the genre this movie belongs to.',
    example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
  })
  @IsUUID()
  genreId: string;
}
