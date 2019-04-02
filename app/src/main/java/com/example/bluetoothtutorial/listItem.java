package com.example.bluetoothtutorial;

import android.bluetooth.BluetoothDevice;

public class listItem {
    private String name;
    private String address;
    private BluetoothDevice device;

    public listItem(String name, String address, BluetoothDevice device){
        this.name = name;
        this.address = address;
        this.device = device;
    }

    public String getName(){
        return name;
    }

    public String getAddress(){
        return address;
    }

    public BluetoothDevice getDevice() {
        return device;
    }
}
