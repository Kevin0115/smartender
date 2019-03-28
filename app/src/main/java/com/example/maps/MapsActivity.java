package com.example.maps;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.libraries.places.api.Places;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private LocationManager lm;
    private LocationListener ll;
    private Location cur_loc;
    private Context context;
    private FloatingActionButton loc_but;
    private Button groc_but;
    private Button rest_but;
    private Button bank_but;
    private Button norm_but;
    private Button terr_but;
    private Button hybr_but;
    private Button sate_but;
    private Button shop_but;
    private Button bus_but;
    private RequestQueue queue;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        context = getApplicationContext();

        //make all the buttons
        this.loc_but = (FloatingActionButton) findViewById(R.id.loc_but);
        this.rest_but = (Button) findViewById(R.id.rest_but);
        this.groc_but = (Button) findViewById(R.id.groc_but);
        this.bank_but = (Button) findViewById(R.id.bank_but);
        this.norm_but = (Button) findViewById(R.id.norm_but);
        this.hybr_but = (Button) findViewById(R.id.hybr_but);
        this.sate_but = (Button) findViewById(R.id.sate_but);
        this.terr_but = (Button) findViewById(R.id.terr_but);
        this.bus_but = (Button) findViewById(R.id.bus_but);
        this.shop_but = (Button) findViewById(R.id.shop_but);

        lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        ll = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                cur_loc = location;
                mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(
                        new LatLng(location.getLatitude(), location
                                .getLongitude()), (float)16.5));
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                startActivity(intent);
            }
        };
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{
                    Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.INTERNET
            },10);
            return;
        }else {
            configGPS();
        }

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        loc_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    mMap.clear();
                    cur_loc = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    LatLng van = new LatLng(cur_loc.getLatitude(),cur_loc.getLongitude());
                    mMap.addMarker(new MarkerOptions().position(van).title("Marker in Vancouver")
                            .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));
                    mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(van,(float)16.5));
                }catch(SecurityException e){
                    Toast.makeText(context, "can't get location", Toast.LENGTH_SHORT).show();}
            }
        });

        //setup places buttons
        queue = Volley.newRequestQueue(this);
        rest_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = search("restaurant");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                        (Request.Method.POST, url, null, new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Log.d("Response", response.toString());
                                displayPlaces(response);
                            }
                        }, new Response.ErrorListener() {

                            @Override
                            public void onErrorResponse(VolleyError error) {
                                Toast.makeText(context, "URL REQUEST ERROR", Toast.LENGTH_SHORT).show();
                            }
                        });
                queue.add(jsonObjectRequest);
            }
        });
        groc_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = search("supermarket");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                        (Request.Method.POST, url, null, new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Log.d("Response", response.toString());
                                displayPlaces(response);
                            }
                        }, new Response.ErrorListener() {

                            @Override
                            public void onErrorResponse(VolleyError error) {
                                Toast.makeText(context, "URL REQUEST ERROR", Toast.LENGTH_SHORT).show();
                            }
                        });
                queue.add(jsonObjectRequest);
            }
        });
        bank_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = search("bank");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                        (Request.Method.POST, url, null, new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Log.d("Response", response.toString());
                                displayPlaces(response);
                            }
                        }, new Response.ErrorListener() {

                            @Override
                            public void onErrorResponse(VolleyError error) {
                                Toast.makeText(context, "URL REQUEST ERROR", Toast.LENGTH_SHORT).show();
                            }
                        });
                queue.add(jsonObjectRequest);
            }
        });

        this.norm_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);
            }
        });

        this.hybr_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mMap.setMapType(GoogleMap.MAP_TYPE_HYBRID);
            }
        });

        this.sate_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mMap.setMapType(GoogleMap.MAP_TYPE_SATELLITE);
            }
        });

        this.terr_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mMap.setMapType(GoogleMap.MAP_TYPE_TERRAIN);
            }
        });

        this.bus_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = search("bus_station");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                        (Request.Method.POST, url, null, new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Log.d("Response", response.toString());
                                displayPlaces(response);
                            }
                        }, new Response.ErrorListener() {

                            @Override
                            public void onErrorResponse(VolleyError error) {
                                Toast.makeText(context, "URL REQUEST ERROR", Toast.LENGTH_SHORT).show();
                            }
                        });
                queue.add(jsonObjectRequest);
            }
        });

        this.shop_but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = search("shopping_mall");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                        (Request.Method.POST, url, null, new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Log.d("Response", response.toString());
                                displayPlaces(response);
                            }
                        }, new Response.ErrorListener() {

                            @Override
                            public void onErrorResponse(VolleyError error) {
                                Toast.makeText(context, "URL REQUEST ERROR", Toast.LENGTH_SHORT).show();
                            }
                        });
                queue.add(jsonObjectRequest);
            }
        });


        Toast.makeText(context, "Make sure API key is working and IP is added to restrictions", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        //super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch(requestCode){
            case 10:
                if(grantResults.length>0 && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                    configGPS();
                return;
        }
    }

    private void configGPS(){
        lm.requestLocationUpdates("gps", 2000, 5, ll);
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        Location location;
        try {
            location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            cur_loc = location;
            LatLng van = new LatLng(location.getLatitude(),location.getLongitude());
            mMap.addMarker(new MarkerOptions().position(van).title("Marker in Vancouver").icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));
            mMap.moveCamera(CameraUpdateFactory.newLatLng(van));
        }catch(SecurityException e){
           Toast.makeText(context, "can't get location", Toast.LENGTH_SHORT).show();}
    }

    private String search(String type){
        StringBuilder url = new StringBuilder("https://maps.googleapis.com/maps/api/place/nearbysearch/json?");
        String lon = Double.toString(cur_loc.getLongitude());
        String lat = Double.toString(cur_loc.getLatitude());
        url.append("location=" + lat + "," + lon + "&");
        url.append("radius=1000" + "&");
        url.append("type=" + type + "&");
        url.append("key=" + "AIzaSyB0Ow0kUPXmD3n9LoEQoJ_J9tFEPyimncc");

        Log.d("Search", "url = "+ url.toString());
        return url.toString();
    }

    private void displayPlaces(JSONObject json){
        ArrayList<placeObject> places = parseLocations(json);
        if(places.size() > 0){
            mMap.clear();
            for(placeObject place: places){
                mMap.addMarker(new MarkerOptions()
                .position(new LatLng(place.getLat(), place.getLon()))
                .title(place.getName()));
            }
            mMap.addMarker(new MarkerOptions().position(new LatLng(cur_loc.getLatitude(), cur_loc.getLongitude()))
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));
            mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(
                    new LatLng(cur_loc.getLatitude(), cur_loc
                            .getLongitude()), (float)14));
        }
        else{
            Toast.makeText(context, "No Results Found", Toast.LENGTH_SHORT).show();
        }
    }

    private ArrayList<placeObject> parseLocations(JSONObject json){
        ArrayList<placeObject> ret = new ArrayList<placeObject>();

        try{
            JSONArray results = json.getJSONArray("results");
            for(int i=0; i<results.length(); i++){
                ret.add(new placeObject(results.getJSONObject(i)));
            }
        }catch(Exception e){Log.d("parseLocations", e.toString());};

        return ret;
    }

    public class placeObject{
        private String name;
        private double lon;
        private double lat;

        public placeObject(JSONObject j){
            try{
                name = j.getString("name");
                lon = new Double(j.getJSONObject("geometry").getJSONObject("location").getString("lng"));
                lat = new Double(j.getJSONObject("geometry").getJSONObject("location").getString("lat"));
            }catch(Exception e){Log.d("placeObject constructor", "JSON parse failed");}
        }

        public String getName() {
            return name;
        }

        public double getLon() {
            return lon;
        }

        public double getLat() {
            return lat;
        }
    }
}

