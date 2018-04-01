package me.curl.campus

import com.google.gson.annotations.SerializedName

data class Posts(
        @SerializedName("posts") var posts: List<Post>
)

data class Post(
        @SerializedName("poster") var poster: Poster,
        @SerializedName("raw_text") var rawText: String = ""
)

data class Poster(
        @SerializedName("name") var name: String = "",
        @SerializedName("picture_url") var pictureUrl: String = ""
)