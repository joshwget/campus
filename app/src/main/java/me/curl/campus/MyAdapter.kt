package me.curl.campus

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.os.AsyncTask
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.*

class MyAdapter() : RecyclerView.Adapter<MyAdapter.ViewHolder>() {
    class ViewHolder(v: LinearLayout, b: Button): RecyclerView.ViewHolder(v) {
        val ll: LinearLayout
        init {
            ll = v
        }
        val button: Button
        init {
            button = b
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup,
                                    viewType:Int):MyAdapter.ViewHolder {
        val v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.post_layout, parent, false) as LinearLayout
        val button = v.findViewById<Button>(R.id.like) as Button
        val vh = ViewHolder(v, button)
        return vh
    }

    override fun onBindViewHolder(holder:ViewHolder, position:Int) {
        val header = holder.ll.getChildAt(0) as LinearLayout
        var posterPicture = header.getChildAt(0) as ImageView
        var headerInfo = header.getChildAt(1) as LinearLayout
        val posterName = headerInfo.getChildAt(0) as TextView

        val body = holder.ll.getChildAt(1) as TextView

        val feed = feedManager.getFeed()
        val size = feed.posts.size

        if (position < size) {
            val post = feed.posts[position]
            var poster = post.poster

            body.setText(post.rawText)
            body.setTextColor(Color.BLACK);

            posterName.setText(poster.name)
            DownloadImageTask(posterPicture).execute(poster.pictureUrl)

            holder.button.setOnClickListener {
                Toast.makeText(holder.ll.context, post.rawText, Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun getItemCount(): Int {
        return feedManager.getFeed().posts.size
    }
}

private class DownloadImageTask(internal var bmImage: ImageView) : AsyncTask<String, Void, Bitmap>() {
    override fun doInBackground(vararg urls: String): Bitmap? {
        val urldisplay = urls[0]
        var mIcon11: Bitmap? = null
        try {
            val `in` = java.net.URL(urldisplay).openStream()
            mIcon11 = BitmapFactory.decodeStream(`in`)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return mIcon11
    }

    override fun onPostExecute(result: Bitmap) {
        bmImage.setImageBitmap(result)
    }
}