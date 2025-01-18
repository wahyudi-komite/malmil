export interface Datalist {
    id: number;
    create: Date;
    timejob: Date;
    rw_volt: number;
    yw_volt: number;
    bw_volt: number;
    ry_volt: number;
    yb_volt: number;
    br_volt: number;
    r_ampere: number;
    y_ampere: number;
    b_ampere: number;
    w_ampere: number;
    wh_powerrecv: number;
    active_power: number;
    apparent_power: number;
    reactive_power: number;
    power_factor: number;
    freq: number;
    hd1_temp: number;
    hd1_hum: number;
    hd2_temp: number;
    hd2_hum: number;
    hd3_temp: number;
    line_run: number;
}
