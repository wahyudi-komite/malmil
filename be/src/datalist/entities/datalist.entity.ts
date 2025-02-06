import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_data15m')
export class Datalist {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  create: Date;
  @Column()
  timejob: Date;
  @Column('float')
  rw_volt: number;
  @Column('float')
  yw_volt: number;
  @Column('float')
  bw_volt: number;
  @Column('float')
  ry_volt: number;
  @Column('float')
  yb_volt: number;
  @Column('float')
  br_volt: number;
  @Column('float')
  r_ampere: number;
  @Column('float')
  y_ampere: number;
  @Column('float')
  b_ampere: number;
  @Column('float')
  w_ampere: number;
  @Column()
  wh_powerrecv: number;
  @Column('float')
  active_power: number;
  @Column('float')
  apparent_power: number;
  @Column('float')
  reactive_power: number;
  @Column('float')
  power_factor: number;
  @Column()
  freq: number;
  @Column()
  hd1_temp: number;
  @Column()
  hd1_hum: number;
  @Column()
  hd2_temp: number;
  @Column()
  hd2_hum: number;
  @Column()
  hd3_temp: number;
  @Column()
  line_run: number;
  @Column({ nullable: true })
  plan_prod: number;
  @Column({ nullable: true })
  target_prod: number;
  @Column({ nullable: true })
  act_prod: number;
  @Column({ nullable: true })
  hd3_hum: number;
}
