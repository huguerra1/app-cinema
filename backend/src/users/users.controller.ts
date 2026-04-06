import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users') // Agrupa os endpoints sob a tag 'users'
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==========================================
  // 1. CRIAR USUÁRIO (Cadastro)
  // ==========================================
  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ==========================================
  // 2. FAZER LOGIN
  // ==========================================
  @Post('login')
  @ApiOperation({ summary: 'Fazer login do usuário' })
  async login(@Body() body: any) {
    // Busca todos os usuários do banco
    const users = await this.usersService.findAll();
    
    // Procura um usuário que tenha o mesmo email e senha digitados no front
    const user = users.find(u => u.email === body.email && u.password === body.password);

    if (!user) {
      // Se não achar, devolve Erro 401 (Não Autorizado)
      throw new UnauthorizedException('Email ou senha incorretos!');
    }

    // Se achar, devolve os dados do usuário para o front-end salvar
    return user;
  }

  // ==========================================
  // 3. LISTAR TODOS OS USUÁRIOS
  // ==========================================
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  findAll() {
    return this.usersService.findAll();
  }

  // ==========================================
  // 4. BUSCAR UM ÚNICO USUÁRIO
  // ==========================================
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ==========================================
  // 5. ATUALIZAR USUÁRIO
  // ==========================================
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuário' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ==========================================
  // 6. DELETAR USUÁRIO
  // ==========================================
  @Delete(':id') 
  @ApiOperation({ summary: 'Remover um usuário' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}