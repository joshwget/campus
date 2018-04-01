package me.curl.campus

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import com.google.gson.Gson

class WebViewFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val rootView = inflater.inflate(R.layout.fragment_webview, container, false)
        val webView = rootView.findViewById<WebView>(R.id.webview)

        val webSettings = webView.getSettings()
        webSettings.setJavaScriptEnabled(true)

        webView.addJavascriptInterface(MyJavaScriptInterface(), "Viewer")
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                webView.loadUrl(socialNetworkJs)
            }
        }

        webView.loadUrl("http://facebook.com/")

        globalWebView = webView

        return rootView
    }

    internal inner class MyJavaScriptInterface() {
        @JavascriptInterface
        fun print(message: String) {
            var feed = Gson().fromJson(message, Posts::class.java)
            feedManager.setFeed(feed)
        }

    }
}