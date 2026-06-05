import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('m_update5s')
export class Datareal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  create: Date;
  @Column('float')
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
  @Column('float')
  wh_powerrecv: number;
  @Column()
  var_recv_lag: number;
  @Column()
  var_recv_lead: number;
  @Column()
  var_trans_lead: number;
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
  mcbstatus_12: number;
  @Column()
  qtyon_modbus_12: number;
  @Column()
  qtyoff_modbus_12: number;
  @Column()
  qty_manual_12: number;
  @Column()
  qty_trip_12: number;
  @Column()
  mcbstatus_13: number;
  @Column()
  qtyon_modbus_13: number;
  @Column()
  qtyoff_modbus_13: number;
  @Column()
  qty_manual_13: number;
  @Column()
  qty_trip_13: number;
  @Column()
  mcbstatus_14: number;
  @Column()
  qtyon_modbus_14: number;
  @Column()
  qtyoff_modbus_14: number;
  @Column()
  qty_manual_14: number;
  @Column()
  qty_trip_14: number;
  @Column()
  mcbstatus_15: number;
  @Column()
  qtyon_modbus_15: number;
  @Column()
  qtyoff_modbus_15: number;
  @Column()
  qty_manual_15: number;
  @Column()
  qty_trip_15: number;
  @Column()
  mcbstatus_16: number;
  @Column()
  qtyon_modbus_16: number;
  @Column()
  qtyoff_modbus_16: number;
  @Column()
  qty_manual_16: number;
  @Column()
  qty_trip_16: number;
  @Column()
  mcbstatus_17: number;
  @Column()
  qtyon_modbus_17: number;
  @Column()
  qtyoff_modbus_17: number;
  @Column()
  qty_manual_17: number;
  @Column()
  qty_trip_17: number;
  @Column()
  mcbstatus_18: number;
  @Column()
  qtyon_modbus_18: number;
  @Column()
  qtyoff_modbus_18: number;
  @Column()
  qty_manual_18: number;
  @Column()
  qty_trip_18: number;
  @Column()
  mcbstatus_19: number;
  @Column()
  qtyon_modbus_19: number;
  @Column()
  qtyoff_modbus_19: number;
  @Column()
  qty_manual_19: number;
  @Column()
  qty_trip_19: number;
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
  hd3_hum: number;
  @Column()
  mavstatus_1: number;
  @Column()
  qtyon_modbus_mav1: number;
  @Column()
  qtyoff_modbus_mav1: number;
  @Column()
  qty_manual_mav1: number;
  @Column()
  mavstatus_2: number;
  @Column()
  qtyon_modbus_mav2: number;
  @Column()
  qtyoff_modbus_mav2: number;
  @Column()
  qty_manual_mav2: number;
}
