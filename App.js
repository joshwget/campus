import React, { Component } from 'react';
import { AppRegistry, WebView, FlatList, StyleSheet, Text, View, ActivityIndicator, Button, Image } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { List, ListItem, SearchBar } from "react-native-elements";

console.disableYellowBox = true

var socialNetworkJs = 'function getPosts(){for(var e=[],t=document.querySelectorAll(".story_body_container"),r=0;r<t.length;r++){var n=t[r],l=getPoster(n),i=getTime(n),o=getRecipient(n),u=n.parentElement.querySelector("footer"),a=getReactions(u),c=getCommentCount(u),g=getLike(u),s=getComment(u),f=n.childNodes[1].innerText;e.push({key:n.parentElement.id,poster:l,time:i,recipient:o,rawText:f,reactions:a,commentCount:c,like:g,comment:s})}return e}function getPoster(e){var t=e.querySelector("i").getAttribute("style").split("\'")[1];return t=(t=(t=t.replaceAll("\\\\3a ",":")).replaceAll("\\\\3d ","=")).replaceAll("\\\\26 ","&"),{name:e.querySelector("strong").innerText,pictureUrl:t}}function getTime(e){var t=e.querySelector("abbr");return t?t.innerText:null}function getRecipient(e){var t=e.querySelector("span");if(!t)return null;for(var r=t.querySelectorAll("a"),n=0;n<r.length;n++){var l=r[n];if(n==r.length-1){var i=l.getAttribute("href");if(i.startsWith("/groups/"))return{type:"group",name:l.innerText,url:i}}}return null}function getReactions(e){if(!e)return null;var t=getReactionBar(e);if(!t)return null;var r=t.querySelector("[data-sigil=reactions-sentence-container]");if(!r)return null;for(var n=[],l=r.querySelectorAll("u"),i=0;i<l.length;i++){var o=l[i];n.push(o.textContent)}var u=r.children[r.children.length-1];return u?{types:n,count:parseInt(u.textContent)}:null}function getCommentCount(e){if(!e)return null;var t=getReactionBar(e);if(!t)return null;var r=t.children[t.children.length-1];return r?parseInt(r.textContent):null}function getReactionBar(e){return e.querySelector("[data-sigil=reactions-bling-bar]")}function getLike(e){return getFooterItem(e,"Like")}function getComment(e){return getFooterItem(e,"Comment")}function getFooterItem(e,t){if(!e)return null;for(var r={},n=e.querySelectorAll("a"),l=0;l<n.length;l++){var i=n[l];if(i.innerText.includes(t)){r={id:i.getAttribute("id")};break}}return r}function onFeedChange(e){new MutationObserver(e).observe(document.querySelector("#MNewsFeed"),{childList:!0})}String.prototype.replaceAll=function(e,t){return this.split(e).join(t)};'
var watchJs = 'var observer=new MutationObserver(function(e){window.postMessage("reload")});observer.observe(document.querySelector("#MNewsFeed"),{childList:!0});'

var urls = [
  "https://m.facebook.com/HallieLomax",
  "https://m.facebook.com/joshwget",
  "https://m.facebook.com/kelsey.endres"
]

class Controller {
  constructor() {
    this.setDataFunction = null;
    this.loadMoreFunction = null;
    this.loadMoreFunction = null;
    this.navigateFunction = null;
  }

  setSetDataFunction(setDataFunction) {
    this.setDataFunction = setDataFunction;
  }

  setData(data) {
    if (this.setDataFunction) {
      this.setDataFunction(data);
    }
  }

  setReloadFunction(reloadFunction) {
    this.reloadFunction = reloadFunction
  }

  reload() {
    if (this.reloadFunction) {
      this.reloadFunction();
    }
  }

  setLoadMoreFunction(loadMoreFunction) {
    this.loadMoreFunction = loadMoreFunction
  }

  loadMore() {
    if (this.loadMoreFunction) {
      this.loadMoreFunction();
    }
  }

  setNavigateFunction(navigateFunction) {
    this.navigateFunction = navigateFunction
  }

  navigate(params) {
    if (this.navigateFunction) {
      console.log('$$')
      this.navigateFunction(params)
    }
  }
}

var controller = new Controller();

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

    controller.setSetDataFunction(this.setData);
  }

  setData = (data) => {
    this.setState({
      data: data,
      loading: false,
      refreshing: false
    });
  }

  handleRefresh = () => {
    controller.reload()
  };

  handleLoadMore = () => {
    controller.loadMore()
  };

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

  onPressNextPage = () => {
    //this.props.navigation.navigate('Real', { url: urls[this.getIndex()] })
    setTimeout(function() {
      controller.navigate({ url: urls[this.getIndex()] })
    }.bind(this), 2000)
  }

  onPrint = () => {
    console.log(this.props.navigation)
  }

  getIndex = () => {
    if (this.props.navigation.index) {
      return this.props.navigation.index
    }
    return 0
  }

  render() {
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <Button
          onPress={this.onPrint}
          title="Print"
        />
        <Button
          onPress={this.onPressNextPage}
          title="Next Page"
        />
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
            var title = item.poster.name
            if (item.recipient) {
              title += ' ▶ ' + item.recipient.name
            }
            var subtitle = ''
            if (item.time) {
              subtitle = item.time
            }
            return (
              <View style={{flex: 1, flexDirection: 'column'}}>
                <ListItem
                  roundAvatar
                  title={`${title}`}
                  subtitle={`${subtitle}`}
                  avatar={{ uri: item.poster.pictureUrl }}
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

class Web extends Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onMessage = this.onMessage.bind(this);

    var that = this;

    controller.setReloadFunction(() => {
      this.onLoad()
    })
    controller.setLoadMoreFunction(() => {
      this.webview.injectJavaScript('window.scrollTo(0,document.body.scrollHeight)')
    })
    controller.setNavigateFunction((params) => {
      console.log(that.props.navigation)
      that.props.navigation.navigate('Web', params)
    })
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
        controller.setData(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  getIndex = () => {
    if (this.props.navigation.index) {
      return this.props.navigation.index
    }
    return 0
  }

  onPressNextPage = () => {
    //this.props.navigation.navigate('Web', { url: urls[this.getIndex()] })
    controller.navigate({ url: urls[this.getIndex()] })
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 20 }} />
        <Button
          onPress={this.onPressNextPage}
          title="Next Page"
        />
        <WebView
          ref={ref => (this.webview = ref)}
          source={{ uri: 'https://m.facebook.com/' }}
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
    );
  }
}

const RealStack = StackNavigator({
  Real: { screen: Real }
});

const WebStack = StackNavigator({
  Web: { screen: Web }
});

export default TabNavigator(
  {
    Timeline: { screen: RealStack },
    Web: { screen: WebStack },
  },
  {
    lazy: false,
  }
);