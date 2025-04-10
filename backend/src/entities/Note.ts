import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isArchived: boolean;
} 