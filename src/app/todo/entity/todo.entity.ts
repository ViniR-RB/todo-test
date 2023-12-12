import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todo' })
export default class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  task: string;
  @Column({ name: 'is_done', type: 'bool' })
  isDone: boolean;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  constructor(todo?: Partial<TodoEntity>) {
    this.id = todo?.id;
    this.task = todo?.task;
    this.isDone = todo?.isDone;
    this.createdAt = todo?.createdAt;
    this.updatedAt = todo?.updatedAt;
    this.deletedAt = todo?.deletedAt;
  }
}
