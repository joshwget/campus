package me.curl.campus

import android.support.v7.app.AppCompatActivity

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter
import android.os.Bundle

import kotlinx.android.synthetic.main.activity_main.*
import android.webkit.WebView

val socialNetworkJs = "javascript:String.prototype.replaceAll=function(r,e){return this.split(r).join(e)};var posts=[],articles=document.querySelectorAll(\".story_body_container\");for(i=0;i<articles.length;i++){var article=articles[i],style=article.querySelector(\"i\").getAttribute(\"style\"),pictureUrl=style.split(\"'\")[1];pictureUrl=(pictureUrl=(pictureUrl=pictureUrl.replaceAll(\"\\\\3a \",\":\")).replaceAll(\"\\\\3d \",\"=\")).replaceAll(\"\\\\26 \",\"&\");var firstStrong=article.querySelector(\"strong\"),name=firstStrong.innerText,rawText=article.childNodes[1].innerText;posts.push({poster:{name:name,picture_url:pictureUrl},raw_text:rawText})}window.Viewer.print(JSON.stringify({posts:posts}));"

var feedManager = FeedManager()
var globalWebView: WebView? = null

class MainActivity : AppCompatActivity() {
    private var mSectionsPagerAdapter: SectionsPagerAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        mSectionsPagerAdapter = SectionsPagerAdapter(supportFragmentManager, feedManager)

        container.adapter = mSectionsPagerAdapter
    }

    inner class SectionsPagerAdapter(fm: FragmentManager, feedManager: FeedManager) : FragmentPagerAdapter(fm) {
        override fun getItem(position: Int): Fragment {
            if (position == 0) {
                return FeedFragment()
            } else if (position == 1) {
                return WebViewFragment()
            }
            return FeedFragment()
        }
        override fun getCount(): Int {
            return 2
        }
    }
}