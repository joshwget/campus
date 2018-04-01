package me.curl.campus

class FeedManager {
    private var mAdapter: MyAdapter? = null
    private var feed = Posts(listOf())

    fun setFeed(newFeed: Posts) {
        feed = newFeed
        if (mAdapter != null) {
            mAdapter!!.notifyDataSetChanged()
        }
    }

    fun getFeed() : Posts {
        return feed
    }

    fun setAdapter(adapter: MyAdapter) {
        mAdapter = adapter
    }
}