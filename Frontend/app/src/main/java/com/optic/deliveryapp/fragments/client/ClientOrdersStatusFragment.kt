package com.optic.deliveryapp.fragments.client

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.optic.deliveryapp.R
import com.optic.deliveryapp.adapters.OrdersClientAdapter
import com.optic.deliveryapp.models.Order
import com.optic.deliveryapp.models.User
import com.optic.deliveryapp.providers.OrdersProvider
import com.optic.deliveryapp.utils.SharedPref
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ClientOrdersStatusFragment : Fragment() {

    var myView: View? = null
    var ordersProvider: OrdersProvider? = null
    var user: User? = null
    var sharedPref: SharedPref? = null

    var recyclerViewOrders: RecyclerView? = null
    var adapter: OrdersClientAdapter? = null

    var status = ""


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        myView = inflater.inflate(R.layout.fragment_client_orders_status, container, false)

        sharedPref = SharedPref(requireActivity())

        status = arguments?.getString("status")!!

        getUserFromSession()
        ordersProvider = OrdersProvider(user?.sessionToken!!)

        recyclerViewOrders = myView?.findViewById(R.id.recyclerview_orders)
        recyclerViewOrders?.layoutManager = LinearLayoutManager(requireContext())

        getOrders()
        return myView
    }

    private fun getOrders(){
        ordersProvider?.getOrdersByClientAndStatus(user?.id!!, status)?.enqueue(object: Callback<ArrayList<Order>>{
            override fun onResponse(call: Call<ArrayList<Order>>, response: Response<ArrayList<Order>>) {
                if(response.body() != null){

                    val orders = response.body()
                    adapter = OrdersClientAdapter(requireActivity(),orders!!)
                    recyclerViewOrders?.adapter = adapter
                }
            }

            override fun onFailure(call: Call<ArrayList<Order>>, t: Throwable) {
                Toast.makeText(requireActivity(), "Error: ${t.message}", Toast.LENGTH_LONG).show()
            }

        })
    }

    private fun getUserFromSession(){

        val gson = Gson()

        if(!sharedPref?.getData("user").isNullOrBlank()){
            //SI EL USUARIO EXISTE EN SESION
            user = gson.fromJson(sharedPref?.getData("user"), User::class.java)
        }
    }

}