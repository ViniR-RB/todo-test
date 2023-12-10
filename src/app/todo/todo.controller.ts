import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import CreateTodoDto from './dto/create_todo.dto';
import UpdateTodoDto from './dto/update_todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('')
  async index() {
    return await this.todoService.findAll();
  }
  @Post('')
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }
  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.updateById(id, body);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.deleteById(id);
  }
}
