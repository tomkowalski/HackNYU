package com.hacknyu.brill.darrengeng.core;

import java.util.Comparator;

/**
 * Created by scalls1 on 2/20/2016.
 */
public class Machine implements Comparator<Machine> {

    //Constructors
    public Machine(String sn, boolean pr) {
        serial_number = sn;
        pro = pr;
        timer_resets = 0;
        lamp_time = 0;
        light_meter_on = 0;
        light_meter_in = 0;
        light_meter_time = 0;
    }

    //Member variables
    protected String serial_number;
    protected int timer_resets;
    protected int lamp_time; // in seconds
    protected boolean pro;
    protected int light_meter_on;
    protected int light_meter_in;
    protected int light_meter_time;

    //Get functions
    public String getSN() { return serial_number; }
    public int getTimer_resets() { return timer_resets; }
    public int getLamp_time() { return lamp_time; }
    public boolean getPro() { return pro; }
    public int getLight_meter_on() {
        if (pro) return light_meter_on;
        return 0;
    }
    public int getLight_meter_in() {
        if (pro) return light_meter_in;
        return 0;
    }
    public int getLight_meter_time() {
        if (pro) return light_meter_time;
        return 0;
    }

    //Set functions
    public void setTimer_resets(final int resets) { timer_resets = resets; }
    public void setLamp_time(final int l_t) { lamp_time = l_t; }
    public void setLMO(final int lmo) { if (pro) light_meter_on = lmo; }
    public void setLMI(final int lmi) { if (pro) light_meter_in = lmi; }
    public void setLMT(final int lmt) { if (pro) light_meter_time = lmt; }
    public void setPro_times(final int lmo, final int lmi, final int lmt) {
        if (pro) {
            light_meter_on = lmo;
            light_meter_in = lmi;
            light_meter_time = lmt;
        }
    }

    //Add functions
    public void addTimer_resets(final int resets) { timer_resets += resets; }
    public void addLamp_time(final int l_t) { lamp_time += l_t; }
    public void addLMO(final int lmo) { if (pro) light_meter_on += lmo; }
    public void addLMI(final int lmi) { if (pro) light_meter_in += lmi; }
    public void addLMT(final int lmt) { if (pro) light_meter_time += lmt; }
    public void addPro_times(final int lmo, final int lmi, final int lmt) {
        if (pro) {
            light_meter_on += lmo;
            light_meter_in += lmi;
            light_meter_time += lmt;
        }
    }


    //Comparator function
    public int compare(Machine m1, Machine m2) { return m1.getSN().compareTo(m2.getSN()); }

}
