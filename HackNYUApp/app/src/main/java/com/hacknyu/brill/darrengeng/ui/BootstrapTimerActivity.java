package com.hacknyu.brill.darrengeng.ui;
import android.os.Bundle;

import com.hacknyu.brill.darrengeng.R;
import android.app.Activity;
import android.view.Menu;
import android.view.View;
import android.widget.TextView;
import android.widget.NumberPicker;
import android.graphics.Color;
import android.widget.Button;

public class BootstrapTimerActivity extends Activity {
    private String format = "";
    private NumberPicker seconds;
    private NumberPicker minutes;
    private NumberPicker hours;
    private Button submit;
    private Button reset;
    private int secs = 0;
    private int mins = 0;
    private int hrs = 0;
    private int totalTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.bootstrap_timer);

        //Get the widgets reference from XML layout
        final TextView tv = (TextView) findViewById(R.id.tv);
        seconds = (NumberPicker) findViewById(R.id.ss);
        minutes = (NumberPicker) findViewById(R.id.mm);
        hours = (NumberPicker) findViewById(R.id.hh);
        //submit = (Button)findViewByID(R.id.submitButton);
        //reset = (Button)findViewByID(R.id.resetButton);

        //Set TextView text color
        tv.setTextColor(Color.parseColor("#ffd32b3b"));
        //Populate NumberPicker values from minimum and maximum value range
        //Set the minimum value of NumberPicker
        seconds.setMinValue(0);
        //Specify the maximum value/number of NumberPicker
        seconds.setMaxValue(60);
        minutes.setMinValue(0);
        minutes.setMaxValue(60);
        hours.setMinValue(0);
        hours.setMaxValue(999);

        //Gets whether the selector wheel wraps when reaching the min/max value.
        seconds.setWrapSelectorWheel(true);
        minutes.setWrapSelectorWheel(true);
        hours.setWrapSelectorWheel(true);

        //Set a value change listener for NumberPicker
        seconds.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
            @Override
            public void onValueChange(NumberPicker picker, int oldVal, int newVal){
                secs = picker.getValue();
                totalTime = 60*60*hrs + 60*mins + secs;
                tv.setText("Seconds(for testing): " + Integer.toString(totalTime));
            }
        });
        minutes.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
            @Override
            public void onValueChange(NumberPicker picker, int oldVal, int newVal){
                mins = picker.getValue();
                totalTime = 60*60*hrs + 60*mins + secs;
                tv.setText("Seconds(for testing): " + Integer.toString(totalTime));
            }
        });
        hours.setOnValueChangedListener(new NumberPicker.OnValueChangeListener() {
            @Override
            public void onValueChange(NumberPicker picker, int oldVal, int newVal){
                hrs = picker.getValue();
                totalTime = 60*60*hrs + 60*mins + secs;
                tv.setText("Seconds(for testing): " + totalTime);
            }
        });

    }


    /*public void showTime(int hour, int min) {
        if (hour == 0) {
            hour += 12;
            format = "AM";
        }
        else if (hour == 12) {
            format = "PM";
        } else if (hour > 12) {
            hour -= 12;
            format = "PM";
        } else {
            format = "AM";
        }
        time.setText(new StringBuilder().append(hour).append(" : ").append(min)
                .append(" ").append(format));
    }*/

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.bootstrap, menu);
        return true;
    }
}
