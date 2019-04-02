package com.example.bluetoothtutorial;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;


import org.w3c.dom.Text;

import java.util.List;

public class customAdapter extends RecyclerView.Adapter<customAdapter.ViewHolder> {

    private List<listItem> listItems;
    private Context context;

    public customAdapter(List<listItem> listItems, Context context) {
        this.listItems = listItems;
        this.context = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View v = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.list_item,viewGroup,false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
       listItem item = listItems.get(i);

       viewHolder.name.setText(item.getName());
       viewHolder.address.setText(item.getAddress());
    }

    @Override
    public int getItemCount() {
        return listItems.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        public TextView name;
        public TextView address;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            name = (TextView) itemView.findViewById(R.id.name);
            address = (TextView) itemView.findViewById(R.id.address);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    MainActivity main = (MainActivity) context;
                    main.connect(address.getText().toString());
                }
            });
        }
    }
}
