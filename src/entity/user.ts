import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 20, default: "" })
  public name: string;

  @Column({ length: 30, default: "" })
  public email: string;

  @Column({ length: 16 })
  public username: string;

  @Column({ length: 16 })
  public password: string;

  @Column({ default: false })
  public disabled: boolean;

  @Column({ default: false })
  public deleted: boolean;

  @CreateDateColumn({ type: "integer" })
  public created: Date;
}
