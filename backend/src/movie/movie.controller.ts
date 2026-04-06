import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all movies' })
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.movieService.remove(id);
  }
}
