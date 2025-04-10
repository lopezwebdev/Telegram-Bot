import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  message: string;

  @Column()
  scheduledTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isCompleted: boolean;
} 