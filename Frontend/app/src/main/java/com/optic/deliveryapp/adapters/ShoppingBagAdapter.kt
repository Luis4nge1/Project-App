package com.optic.deliveryapp.adapters

import android.app.Activity
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.optic.deliveryapp.R
import com.optic.deliveryapp.activities.client.home.ClientHomeActivity
import com.optic.deliveryapp.activities.client.products.detail.ClientProductsDetailActivity
import com.optic.deliveryapp.activities.client.shopping_bag.ClientShoppingBagActivity
import com.optic.deliveryapp.activities.delivery.home.DeliveryHomeActivity
import com.optic.deliveryapp.activities.restaurant.home.RestaurantHomeActivity
import com.optic.deliveryapp.models.Category
import com.optic.deliveryapp.models.Product
import com.optic.deliveryapp.models.Rol
import com.optic.deliveryapp.utils.SharedPref

class ShoppingBagAdapter (val context: Activity, val products: ArrayList<Product>): RecyclerView.Adapter<ShoppingBagAdapter.ShoppingBagViewHolder>(){

    val sharedPref = SharedPref(context)

    init {
        (context as ClientShoppingBagActivity).setTotal(getTotal())
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ShoppingBagViewHolder {

        val view = LayoutInflater.from(parent.context).inflate(R.layout.cardview_shopping_bag, parent, false)

        return ShoppingBagViewHolder(view)
    }

    override fun getItemCount(): Int {
        return products.size
    }

    override fun onBindViewHolder(holder: ShoppingBagViewHolder, position: Int) {
        val product = products[position]

        holder.textViewName.text = product.name
        holder.textViewCounter.text = "${product.quantity}"
        if(product.quantity != null){
            holder.textViewPrice.text = "S/.${product.price * product.quantity!!}"
        }
        Glide.with(context).load(product.image1).into(holder.imageViewProduct)

        holder.imageViewAdd.setOnClickListener { addItem(product, holder) }
        holder.imageViewRemove.setOnClickListener { removeItem(product, holder) }
        holder.imageViewDelete.setOnClickListener { deleteItem(position) }

        //holder.itemView.setOnClickListener{goToDetail(product)}
    }

    private fun getTotal(): Double{
        var total = 0.0
        for(p in products){
            if(p.quantity != null){
                total = total + (p.quantity!! * p.price)
            }

        }
        return total
    }
    private fun goToDetail(product: Product){
        val i = Intent(context, ClientProductsDetailActivity::class.java)
        i.putExtra("product",product.toJason())
        context.startActivity(i)
    }

    private fun getIndexOf(idProduct: String): Int{
        var pos = 0

        for (p in products){
            if(p.id == idProduct){
                return pos
            }
            pos++
        }
        return -1
    }

    private fun deleteItem(position: Int){
        products.removeAt(position)
        notifyItemRemoved(position)
        notifyItemRangeRemoved(position, products.size)
        sharedPref.save("order", products)
        (context as ClientShoppingBagActivity).setTotal(getTotal())
    }

    private fun addItem(product: Product, holder: ShoppingBagViewHolder){
        val index = getIndexOf(product.id!!)
        product.quantity = product.quantity!! + 1
        products[index].quantity = product.quantity


        holder.textViewCounter.text = "${product.quantity}"
        holder.textViewPrice.text ="S/.${product.quantity!! * product.price!!}"

        sharedPref.save("order", products)
        (context as ClientShoppingBagActivity).setTotal(getTotal())
    }

    private fun removeItem(product: Product, holder: ShoppingBagViewHolder){

        if(product.quantity!! > 1){
            val index = getIndexOf(product.id!!)
            product.quantity = product.quantity!! - 1
            products[index].quantity = product.quantity
            holder.textViewCounter.text = "${product.quantity}"
            holder.textViewPrice.text ="S/.${product.quantity!! * product.price!!}"

            sharedPref.save("order", products)
            (context as ClientShoppingBagActivity).setTotal(getTotal())
        }
    }

    class ShoppingBagViewHolder(view: View): RecyclerView.ViewHolder(view){

        val textViewName: TextView
        val textViewPrice: TextView
        val textViewCounter: TextView
        val imageViewProduct: ImageView
        val imageViewAdd: ImageView
        val imageViewRemove: ImageView
        val imageViewDelete: ImageView

        init{
            textViewName = view.findViewById(R.id.textview_name)
            textViewPrice = view.findViewById(R.id.textview_price)
            textViewCounter = view.findViewById(R.id.textview_counter)
            imageViewProduct = view.findViewById(R.id.imageview_product)
            imageViewAdd = view.findViewById(R.id.imageview_add)
            imageViewRemove = view.findViewById(R.id.imageview_remove)
            imageViewDelete = view.findViewById(R.id.imageview_delete)
        }
    }
}