import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'uuid', name: 'user_uuid', unique: true })
  userUuid: string;

  @Column({ nullable: false, type: 'varchar', unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
