import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import CreateTodoDto from './dto/create_todo.dto';
import UpdateTodoDto from './dto/update_todo.dto';
import TodoEntity from './entity/todo.entity';
import { TodoController } from './todo.controller';
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
const todoEntityItemUpdated = new TodoEntity({
  id: '128372183721837128',
  task: 'task-2',
  isDone: false,
});
describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            create: jest.fn().mockResolvedValue(todoEntityList[0]),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            updateById: jest.fn().mockResolvedValue(todoEntityItemUpdated),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return list todo entity sucessfully', async () => {
      // Act
      const result = await controller.index();

      // Assert
      expect(result).toEqual(todoEntityList);
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });
    it('should return throw an error', async () => {
      // Arrange
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());
      // Act
      const result = controller.index();

      // Assert
      expect(result).rejects.toThrow();
    });
  });
  describe('create', () => {
    it('should return todo entity item sucessfully', async () => {
      // ACT
      const createDto: CreateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      const result = await controller.create(createDto);
      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(createDto);
    });
    it('should return throw an error', async () => {
      // Arrange
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());
      // ACT
      const createDto: CreateTodoDto = {
        task: 'task-1',
        isDone: true,
      };
      const result = controller.create(createDto);
      // Assert
      expect(result).rejects.toThrow();
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(createDto);
    });
  });
  describe('show', () => {
    it('should return todo entity item by id sucessfully ', async () => {
      // ACT
      const id: string = '128372183721837128';
      const result = await controller.show(id);

      // Assert
      expect(result).toEqual(todoEntityList[0]);
    });
    it('should return throw an error ', async () => {
      // Arrange
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());
      // ACT
      const id: string = '128372183721837128';
      const result = controller.show(id);

      // Assert
      expect(result).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    it('should return todo entity item updated sucessfully', async () => {
      // ACT
      const id: string = '128372183721837128';
      const updatedDto: UpdateTodoDto = {
        task: 'task-2',
        isDone: false,
      };
      const result = await controller.update(id, updatedDto);
      // Assert
      expect(result).toEqual(todoEntityItemUpdated);
      expect(todoService.updateById).toHaveBeenCalledWith(id, updatedDto);
    });
    it('should return throw an Error', async () => {
      // Arrange
      jest.spyOn(todoService, 'updateById').mockRejectedValueOnce(new Error());
      // ACT
      const id: string = '128372183721837128';
      const updatedDto: UpdateTodoDto = {
        task: 'task-2',
        isDone: false,
      };
      const result = controller.update(id, updatedDto);
      // Assert
      expect(result).rejects.toThrow();
      expect(todoService.updateById).toHaveBeenCalledWith(id, updatedDto);
      expect(todoService.updateById).toHaveBeenCalledTimes(1);
    });
  });
  describe('destroy', () => {
    it('should return no content sucessfully', async () => {
      // ACT
      const id: string = '128372183721837128';
      const result = await controller.destroy(id);
      // Assert
      expect(result).toBeUndefined();
    });
    it('should return no content sucessfully', async () => {
      // Arrange
      jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());
      // ACT
      const id: string = '128372183721837128';
      const result = controller.destroy(id);
      // Assert
      expect(result).rejects.toThrow();
    });
  });
});
