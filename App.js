import React, { Component } from 'react';
import { AppRegistry, WebView, FlatList, StyleSheet, Text, View, ActivityIndicator, Button, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Avatar, List, ListItem, SearchBar } from "react-native-elements";

console.disableYellowBox = true

var socialNetworkJs = 'function getPosts(){for(var e=[],t=document.querySelectorAll(".story_body_container"),r=0;r<t.length;r++){var n=t[r],l=getPoster(n),i=getTime(n),o=getRecipient(n),u=n.parentElement.querySelector("footer"),c=getReactions(u),a=getCommentCount(u),g=getLike(u),s=getComment(u),f=n.childNodes[1].innerText;e.push({key:n.parentElement.id,poster:l,time:i,recipient:o,rawText:f,reactions:c,commentCount:a,like:g,comment:s})}return e}function getPoster(e){var t=e.querySelector("i").getAttribute("style").split("\'")[1];t=(t=(t=t.replaceAll("\\\\3a ",":")).replaceAll("\\\\3d ","=")).replaceAll("\\\\26 ","&");var r=e.querySelector("strong");return{name:r.innerText,pictureUrl:t,url:r.querySelector("a").getAttribute("href")}}function getTime(e){var t=e.querySelector("abbr");return t?t.innerText:null}function getRecipient(e){var t=e.querySelector("span");if(!t)return null;for(var r=t.querySelectorAll("a"),n=0;n<r.length;n++){var l=r[n];if(n==r.length-1){var i=l.getAttribute("href");if(i.startsWith("/groups/"))return{type:"group",name:l.innerText,url:i}}}return null}function getReactions(e){if(!e)return null;var t=getReactionBar(e);if(!t)return null;var r=t.querySelector("[data-sigil=reactions-sentence-container]");if(!r)return null;for(var n=[],l=r.querySelectorAll("u"),i=0;i<l.length;i++){var o=l[i];n.push(o.textContent)}var u=r.children[r.children.length-1];return u?{types:n,count:parseInt(u.textContent)}:null}function getCommentCount(e){if(!e)return null;var t=getReactionBar(e);if(!t)return null;var r=t.children[t.children.length-1];return r?parseInt(r.textContent):null}function getReactionBar(e){return e.querySelector("[data-sigil=reactions-bling-bar]")}function getLike(e){return getFooterItem(e,"Like")}function getComment(e){return getFooterItem(e,"Comment")}function getFooterItem(e,t){if(!e)return null;for(var r={},n=e.querySelectorAll("a"),l=0;l<n.length;l++){var i=n[l];if(i.innerText.includes(t)){r={id:i.getAttribute("id")};break}}return r}function getNotifications(){for(var e=[],t=document.querySelectorAll(".aclb"),r=0;r<t.length;r++){var n=t[r],l=n.querySelector(".c"),i=n.querySelector("abbr");if(l&&i){var o=l.innerText,u=i.innerText;o=o.slice(0,o.length-u.length-2),e.push({text:o,time:u})}}return e}function onFeedChange(e){new MutationObserver(e).observe(document.querySelector("#MNewsFeed"),{childList:!0})}String.prototype.replaceAll=function(e,t){return this.split(e).join(t)};'
// TODO: no need for this, it's already in socialnetwork.js
var watchJs = 'var observer=new MutationObserver(function(e){window.postMessage("reload")});observer.observe(document.querySelector("#MNewsFeed"),{childList:!0});'

const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

class Real extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };

    this.onLoad = this.onLoad.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  getUrl = () => {
    if (this.props.navigation.state.params && this.props.navigation.state.params.url) {
      return 'https://m.facebook.com/' + this.props.navigation.state.params.url
    }
    return 'https://m.facebook.com/'
  }

  onLoad() {
    this.webview.injectJavaScript(socialNetworkJs)
    this.webview.injectJavaScript('window.postMessage(JSON.stringify(getPosts()))');
    this.webview.injectJavaScript(watchJs)
  }

  onMessage(data) {
    try {
      if (data == 'reload') {
        this.webview.injectJavaScript(socialNetworkJs)
        this.webview.injectJavaScript('window.postMessage(JSON.stringify(getPosts()))');
      } else {
        data = JSON.parse(data)
        this.setData(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  setData = (data) => {
    this.setState({
      data: data,
      loading: false,
      refreshing: false
    });
  }

  handleRefresh = () => {
    this.onLoad()
  };

  handleLoadMore = () => {
    this.webview.injectJavaScript('window.scrollTo(0,document.body.scrollHeight)')
  };

  onPressNextPage = (url) => {
    this.props.navigation.navigate('Real', { url: url })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 10,
          marginVertical: 15,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  render() {
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <View style={{ height: 0 }}>
          <WebView
            ref={ref => (this.webview = ref)}
            source={{ uri: this.getUrl() }}
            onLoad={this.onLoad}
            onError={console.error.bind(console, 'error')}
            bounces={false}
            onShouldStartLoadWithRequest={() => true}
            javaScriptEnabledAndroid={true}
            startInLoadingState={true}
            style={{ flex: 1 }}
            onMessage={(event) => this.onMessage(event.nativeEvent.data)}
            injectedJavaScript={patchPostMessageJsCode}
          />
        </View>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => {
            const reactions = item.reactions ? (
              <Text>{item.reactions.count} Reactions</Text>
            ) : (
              <Text></Text>
            )
            const comments = item.commentCount ? (
              <Text>{item.commentCount} Comments</Text>
            ) : (
              <Text></Text>
            )
            const title = item.recipient ? (
              <Text>
                <Text onPress={() => this.onPressNextPage(item.poster.url)}>
                  {item.poster.name}
                </Text>
                ▶
                <Text>
                  <Text onPress={() => this.onPressNextPage(item.recipient.url)}>
                    {item.recipient.name}
                  </Text>
                </Text>
              </Text>
            ) : (
              <Text>
                <Text onPress={() => this.onPressNextPage(item.poster.url)}>
                  {item.poster.name}
                </Text>
              </Text>
            )
            const subtitle = item.time ? (
              <Text>{item.time}</Text>
            ) : null
            return (
              <View style={{flex: 1, flexDirection: 'column'}}>
                <ListItem
                  avatar={<Avatar
                    rounded
                    source={item.poster.pictureUrl && {uri: item.poster.pictureUrl}}
                    onPress={() => this.onPressNextPage(item.poster.url)}
                  />}
                  title={title}
                  subtitle={subtitle}
                  containerStyle={{ borderBottomWidth: 0 }}
                  hideChevron={true}
                />
                <Text>{item.rawText}</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  {reactions}
                  {comments}
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                  <Button title="Like"/>
                  <Button title="Comment"/>
                  <Button title="Share"/>
                </View>
              </View>
            )
          }}
          keyExtractor={item => item.key}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
    );
  }
}

const RealStack = StackNavigator({
  Real: { screen: Real }
});

export default RealStack;