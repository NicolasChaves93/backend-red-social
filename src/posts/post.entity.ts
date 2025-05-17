import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  content: string;
  
  @Column({ nullable: true })
  imageUrl: string;
  
  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  author: User;
  
  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'post_likes',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  likes: User[];
  
  @Column({ default: 0 })
  likesCount: number;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
