package com.example.bluetoothtutorial;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class MainActivity extends AppCompatActivity {

    static final int REQUEST_ENABLE_BT = 1;
    private BluetoothAdapter bluetoothAdapter;
    private Context context;
    private RecyclerView conRecyclerView;
    private RecyclerView.Adapter conAdapter;
    private RecyclerView.LayoutManager conLayoutManger;
    private RecyclerView disRecyclerView;
    private RecyclerView.Adapter disAdapter;
    private RecyclerView.LayoutManager disLayoutManger;
    public List<listItem> conList = new ArrayList<>();
    public List<listItem> disList = new ArrayList<>();
    private Button scan;
    private Button send;
    private BluetoothSocket mmSocket = null;
    public static InputStream mmInStream = null;
    public static OutputStream mmOutStream = null;
    private boolean Connected = false;
    private RequestQueue req;
    private EditText send_text;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context = getApplicationContext();

        //setup bluetooth
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if(bluetoothAdapter == null) {
            Toast.makeText(context, "ERROR: bluetoothAdapter null", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        if (!bluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }


        //set up recycler views
        conRecyclerView = (RecyclerView) findViewById(R.id.connected_list);
        conRecyclerView.setHasFixedSize(true);
        conLayoutManger = new LinearLayoutManager(context);
        conRecyclerView.setLayoutManager(conLayoutManger);

        disRecyclerView = (RecyclerView) findViewById(R.id.discover_list);
        disRecyclerView.setHasFixedSize(true);
        disLayoutManger = new LinearLayoutManager(context);
        disRecyclerView.setLayoutManager(disLayoutManger);

        //update connected Devices list
        conAdapter = new customAdapter(conList, MainActivity.this);
        conRecyclerView.setAdapter(conAdapter);
        updateConnectedDevices();

        // Register for broadcasts when a device is discovered.
        IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
        registerReceiver(receiver, filter);
        disAdapter = new customAdapter(disList,MainActivity.this);
        disRecyclerView.setAdapter(disAdapter);

        scan = (Button)findViewById(R.id.scan);
        scan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                scanBT();
            }
        });

        send = (Button)findViewById(R.id.send);
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendData();
            }
        });
        this.req = Volley.newRequestQueue(this);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent resultIntent){
        if(requestCode == REQUEST_ENABLE_BT){
            if(resultCode != RESULT_OK){
                finish();
                return;
            }
        }
    }

    protected void updateConnectedDevices(){
        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        conList.clear();
        if(pairedDevices.size() > 0){
            for(BluetoothDevice device : pairedDevices){
                String deviceName = device.getName();
                String deviceHardwareAddress = device.getAddress();
                listItem item = new listItem(deviceName,deviceHardwareAddress,device);
                conList.add(item);
                conAdapter.notifyDataSetChanged();
            }
        }
    }

    // Create a BroadcastReceiver for ACTION_FOUND.
    private final BroadcastReceiver receiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                // Discovery has found a device. Get the BluetoothDevice
                // object and its info from the Intent.
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                String deviceName = device.getName();
                String deviceHardwareAddress = device.getAddress(); // MAC address
                listItem item = new listItem(deviceName,deviceHardwareAddress, device);
                disList.add(item);
                disAdapter.notifyDataSetChanged();
            }
        }
    };


    protected void scanBT(){
        disList.clear();
        int MY_PERMISSIONS_REQUEST_ACCESS_COARSE_LOCATION = 1;
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},
                MY_PERMISSIONS_REQUEST_ACCESS_COARSE_LOCATION);
        if(bluetoothAdapter.isDiscovering()){
            bluetoothAdapter.cancelDiscovery();
        }
        if(!bluetoothAdapter.startDiscovery()){
            Toast.makeText(context, "Discovery Failed", Toast.LENGTH_SHORT).show();
        }else{
            Toast.makeText(context, "Discovering", Toast.LENGTH_SHORT).show();
        }
    }

    protected void sendData(){
        if(!Connected)
            return;
        try{
            mmOutStream.write("Hello".getBytes());
        }catch(IOException e){}
    }

    public void connect(String address){
        if(bluetoothAdapter.isDiscovering()){
            bluetoothAdapter.cancelDiscovery();
        }

        for(listItem item: disList){
            if(item.getAddress() == address){
                BluetoothDevice device = item.getDevice();
                if(Connected){closeConnection();}
                CreateSerialBluetoothDeviceSocket(device);
                ConnectToSerialBluetoothDevice(device);
                updateConnectedDevices();
                return;
            }
        }

        Toast.makeText(this.context,"Error can't find address", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        unregisterReceiver(receiver);
    }

    protected void closeConnection(){
        try{
            mmInStream.close();
            mmInStream = null;
        } catch(IOException e){}

        try{
            mmOutStream.close();
            mmOutStream = null;
        } catch(IOException e){}

        try{
            mmSocket.close();
            mmSocket = null;
        } catch(IOException e){}

        Connected = false;
    }

    public void CreateSerialBluetoothDeviceSocket(BluetoothDevice device){
        mmSocket = null;

        UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");//device.getUuids()[0].getUuid();

        //try {
            try{
            final Method m = device.getClass().getMethod("createInsecureRfcommSocketToServiceRecord", UUID.class);
            mmSocket = (BluetoothSocket)m.invoke(device, MY_UUID);}
            catch(Exception e){
            }
       // } catch (IOException e){
         //   Toast.makeText(context, "Socket Creation Failed", Toast.LENGTH_SHORT).show();
        //}
    }

    public void ConnectToSerialBluetoothDevice(BluetoothDevice device){
        bluetoothAdapter.cancelDiscovery();
        try{
            mmSocket.connect();
            Toast.makeText(context, "connection made", Toast.LENGTH_SHORT).show();
        }catch(IOException e){
            try{
                mmSocket =(BluetoothSocket) device.getClass().getMethod("createRfcommSocket", new Class[] {int.class}).invoke(device,1);
                mmSocket.connect();

            }catch(Exception e2){}
            Toast.makeText(context, "connection failed", Toast.LENGTH_SHORT).show();
            try{
            mmSocket.close();
            Toast.makeText(context, "closing", Toast.LENGTH_SHORT).show();}
            catch (IOException f){}

            e.printStackTrace();
        }

        GetInputOutputStreamForSocket();
        Connected = true;
    }

    public void GetInputOutputStreamForSocket(){
        try{
            mmInStream = mmSocket.getInputStream();
            mmOutStream = mmSocket.getOutputStream();
        }catch(IOException e){
            Toast.makeText(context, "Sockets failed", Toast.LENGTH_SHORT).show();
        }
    }
}
