import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateTodoDto from './dto/create_todo.dto';
import UpdateTodoDto from './dto/update_todo.dto';
import TodoEntity from './entity/todo.entity';
import { TodoService } from './todo.service';
const todoEntityList: TodoEntity[] = [
  new TodoEntity({
    id: '128372183721837128',
    task: 'task-1',
    isDone: true,
  }),
  new TodoEntity({
    task: 'task-2',
    isDone: false,
  }),
  new TodoEntity({
    task: 'task-3',
    isDone: true,
  }),
];
const updateTodoEntityItem: TodoEntity = new TodoEntity({
  task: 'task-1',
  isDone: true,
});
describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: Repository<TodoEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneByOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockReturnValue(todoEntityList[0]),
            merge: jest.fn().mockReturnValue(updateTodoEntityItem),
            softDelete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined service and repository', () => {
    expect(service).toBeDefined();
    expect(todoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return todo list entity sucessfully', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(todoEntityList);
      expect(result.length).toEqual(3);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });
    it('should return throw an exception', async () => {
      // Arrange
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      // Assert
      expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('find one or fail', () => {
    it('should return  todo entity sucessfully', async () => {
      // Act
      const id: string = '128372183721837128';
      const result = await service.findOneOrFail(id);
      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
    });
    it('should return not found exeption', async () => {
      // Arrange
      jest
        .spyOn(todoRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());
      // Act
      const id: string = '128372183721837128';
      const result = service.findOneOrFail(id);
      // Assert
      expect(result).rejects.toThrow(NotFoundException);
      expect(todoRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new todo item sucessfully', async () => {
      // Arrange
      const data: CreateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      // ACT
      const result = await service.create(data);
      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should thorw an exception', async () => {
      // Arrange
      const data: CreateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      // ACT
      const result = service.create(data);
      // Assert
      expect(result).rejects.toThrow();
    });
  });
  describe('update by id', () => {
    it('should return todo entity updated sucessfuly', async () => {
      // Arrange
      const id: string = '128372183721837128';
      const data: UpdateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      jest
        .spyOn(todoRepository, 'save')
        .mockResolvedValueOnce(updateTodoEntityItem);
      // ACT
      const result = await service.updateById(id, data);

      // Assert
      expect(result).toEqual(data);
    });
    it('should throw an not found exception', () => {
      const data: UpdateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      jest
        .spyOn(todoRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());

      expect(service.updateById('1', data)).rejects.toThrow(NotFoundException);
    });
    it('should throw an error', () => {
      const data: UpdateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(service.updateById('1', data)).rejects.toThrow(Error);
    });
  });
  describe('deleteById', () => {
    it('should return empty from sucessfully', async () => {
      // Arrange
      const id: string = '128372183721837128';
      // ACT

      const result = await service.deleteById(id);

      // Assert
      expect(result).toEqual(undefined);
      expect(todoRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });
    it('should throw an not found exception', async () => {
      // Arrange
      const id: string = '128372183721837128';
      jest
        .spyOn(todoRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new NotFoundException());

      // ACT
      const result = service.deleteById(id);
      // Assert
      expect(result).rejects.toThrow(NotFoundException);
      expect(todoRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(0);
    });
    it('should throw an exception', async () => {
      // Arrange
      const id: string = '128372183721837128';
      jest
        .spyOn(todoRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());
      // ACT
      const result = service.deleteById(id);

      // Assert
      expect(result).rejects.toThrow(Error);
      expect(todoRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });
});
