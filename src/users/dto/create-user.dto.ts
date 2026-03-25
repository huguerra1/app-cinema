import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'ID do Perfil (Se vazio, será USER)' })
  @IsOptional() // <-- Agora não é mais obrigatório!
  @IsUUID()
  profileId?: string;
}