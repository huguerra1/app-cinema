import { Controller, Get, Post, Body, Patch, Param, Delete } from
'@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('users') // Agrupa os endpoints sob a tag 'users'
@Controller('users')
export class UsersController {
 constructor(private readonly usersService: UsersService) {}
 @Post()
 @ApiOperation({ summary: 'Criar um novo usuário' })
 @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.'
})
 @ApiResponse({ status: 400, description: 'Dados inválidos.' })
 create(@Body() createUserDto: CreateUserDto) {
 return this.usersService.create(createUserDto);
 }
 @Get(':id')
 @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
 findOne(@Param('id') id: string) {
 return this.usersService.findOne(id);
 }
 @Patch(':id')
 @ApiOperation({ summary: 'Atualizar um usuário' })
 update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
 return this.usersService.update(id, updateUserDto);
 }
 @Delete(':id') 
 @ApiOperation({ summary: 'Remover um usuário' })
 remove(@Param('id') id: string) {
 return this.usersService.remove(id);
 }
}
