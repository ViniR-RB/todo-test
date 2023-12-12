import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TodoEntity from './entity/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}
  async findAll(): Promise<TodoEntity[]> {
    return await this.todoRepository.find();
  }

  async create(data) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  async updateById(id: string, data) {
    const todo = await this.findOneOrFail(id);
    this.todoRepository.merge(todo, data);
    return this.todoRepository.save(todo);
  }
  async deleteById(id: string) {
    await this.findOneOrFail(id);
    await this.todoRepository.softDelete(id);
  }

  async findOneOrFail(id: string) {
    try {
      return await this.todoRepository.findOneByOrFail({ id: id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
