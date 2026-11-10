import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'ADMIN', description: 'Nome do perfil' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
