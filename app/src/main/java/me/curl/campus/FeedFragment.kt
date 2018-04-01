package me.curl.campus

import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

class FeedFragment() : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        var mRecyclerView = inflater.inflate(R.layout.my_recycler_view, container, false) as RecyclerView

        mRecyclerView.setHasFixedSize(false)

        var mLayoutManager = LinearLayoutManager(this.context)
        mRecyclerView.setLayoutManager(mLayoutManager)

        var mAdapter = MyAdapter()
        mRecyclerView.setAdapter(mAdapter)

        feedManager.setAdapter(mAdapter)

        mRecyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener(){
            override fun onScrolled(recyclerView: RecyclerView?, dx: Int, dy: Int) {
                val isBottomReached = !recyclerView!!.canScrollVertically(1)
                if (isBottomReached && globalWebView != null) {
                    globalWebView!!.loadUrl("javascript:window.scrollTo(0,document.body.scrollHeight)");
                    globalWebView!!.loadUrl(socialNetworkJs)
                }
            }
        })

        return mRecyclerView
    }
}