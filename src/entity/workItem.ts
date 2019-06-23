import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class WorkItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  public text: string;

  @Column({ default: false })
  public checked: boolean;

  @CreateDateColumn({ type: "integer" })
  public created: Date;

  @UpdateDateColumn({ type: "integer" })
  public updated: Date;
}
