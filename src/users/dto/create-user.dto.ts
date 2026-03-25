import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'hugo@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Hugo Silva' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'ID do Perfil (UUID)' })
  @IsUUID()
  profileId!: string;
}