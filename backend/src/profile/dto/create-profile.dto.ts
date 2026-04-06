import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'ADMIN', description: 'Nome do perfil' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}