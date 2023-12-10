import { IsNotEmpty } from 'class-validator';

export default class CreateTodoDto {
  @IsNotEmpty()
  task: string;
  @IsNotEmpty()
  isDone: string;
}
