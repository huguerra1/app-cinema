import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse , ApiBody } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('users') // Agrupa os endpoints sob a tag 'users'
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,private jwtService: JwtService) {}

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
  // ==========================================
  // 2. FAZER LOGIN (Agora com JWT!)
  // ==========================================
 @Post('login')
  @ApiOperation({ summary: 'Fazer login e receber JWT' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'hugofmourao@gmail.com' },
        password: { type: 'string', example: 'sua_senha_aqui' }
      }
    }
  })
  async login(@Body() body: any) {
    const users = await this.usersService.findAll();
    
    // Procura o usuário
    const user = users.find(u => u.email === body.email && u.password === body.password);

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos!');
    }

    // 1. Monta o "Payload" (A carga útil que vai dentro do Token)
    // Nunca coloque senhas aqui! Apenas dados públicos e identificadores.
    const payload = { 
      sub: user.id, // 'sub' é o padrão JWT para o ID do usuário
      email: user.email,
      role: user.profile?.name || 'USER' 
    };

    // 2. Gera o Token criptografado
    const token = await this.jwtService.signAsync(payload);

    // 3. Devolve o Token e os dados do usuário
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile?.name
      }
    };
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