package com.optic.deliveryapp.activities.client.orders.detail

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.optic.deliveryapp.R
import com.optic.deliveryapp.activities.client.orders.map.ClientOrdersMapActivity
import com.optic.deliveryapp.activities.delivery.orders.map.DeliveryOrdersMapActivity
import com.optic.deliveryapp.adapters.OrderProductsAdapter
import com.optic.deliveryapp.adapters.OrdersClientAdapter
import com.optic.deliveryapp.models.Order

class ClientOrdersDetailActivity : AppCompatActivity() {

    val TAG = "ClientOrdersDetail"
    var order: Order? = null
    val gson =  Gson()

    var toolbar: Toolbar? = null
    var textViewClient: TextView? = null
    var textViewAddress: TextView? = null
    var textViewDate: TextView? = null
    var textViewTotal: TextView? = null
    var textViewStatus: TextView? = null
    var recyclerViewProducts: RecyclerView? = null
    var buttonGoToMap: Button? = null

    var adapter: OrderProductsAdapter? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_client_orders_detail)

        order = gson.fromJson(intent.getStringExtra("order"), Order::class.java)

        toolbar = findViewById(R.id.toolbar)
        toolbar?.setTitleTextColor(ContextCompat.getColor(this, R.color.white))
        toolbar?.title = "Order #${order?.id}"
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        textViewClient = findViewById(R.id.textview_client)
        textViewAddress = findViewById(R.id.textview_address)
        textViewDate= findViewById(R.id.textview_date)
        textViewTotal = findViewById(R.id.textview_total)
        textViewStatus= findViewById(R.id.textview_status)
        buttonGoToMap = findViewById(R.id.btn_go_to_map)

        recyclerViewProducts = findViewById(R.id.recyclerview_products)
        recyclerViewProducts?.layoutManager = LinearLayoutManager(this)

        adapter = OrderProductsAdapter(this, order?.products!!)
        recyclerViewProducts?.adapter = adapter


        textViewClient?.text = "${order?.client?.name} ${order?.client?.lastname}"
        textViewAddress?.text = order?.address?.address
        textViewDate?.text = "${order?.timestamp}"
        textViewStatus?.text = order?.status

        Log.d(TAG, "Orden: ${order.toString()}")

        getTotal()

        if(order?.status == "EN CAMINO"){
            buttonGoToMap?.visibility = View.VISIBLE
        }

        buttonGoToMap?.setOnClickListener { goToMap() }

    }

    private fun goToMap(){
        val i = Intent(this, ClientOrdersMapActivity::class.java)
        i.putExtra("order", order?.toJson())
        startActivity(i)
    }

    private fun getTotal(){
        var total = 0.0

        for (p in order?.products!!){
            total = total + (p.price * p.quantity!!)
        }

        textViewTotal?.text = "S/.${total}"
    }
}