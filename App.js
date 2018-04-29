import React, { Component } from 'react';
import { AppRegistry, WebView, FlatList, StyleSheet, Text, View, ActivityIndicator, Button, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { List, ListItem, SearchBar } from "react-native-elements";

console.disableYellowBox = true

var socialNetworkJs = 'function getPosts(){for(var e=[],t=document.querySelectorAll(".story_body_container"),r=0;r<t.length;r++){var n=t[r],o=getPoster(n),l=n.childNodes[1].innerText;e.push({key:n.parentElement.id,poster:o,raw_text:l})}return e}function getPoster(e){var t=e.querySelector("i").getAttribute("style").split("\'")[1];return t=(t=(t=t.replaceAll("\\\\3a ",":")).replaceAll("\\\\3d ","=")).replaceAll("\\\\26 ","&"),{name:e.querySelector("strong").innerText,picture_url:t}}function getRecipient(e){for(var t={},r=e.querySelector("span").querySelectorAll("a"),n=0;n<r.length;n++){var o=r[n];if(n==r.length-1){var l=o.getAttribute("href");if(l.startsWith("/groups/")){t={type:"group",name:o.innerText,url:l};break}}}return t}function getLike(e){return getFooterItem(e,"Like")}function getComment(e){return getFooterItem(e,"Comment")}function getFooterItem(e,t){for(var r={},n=e.querySelectorAll("a"),o=0;o<n.length;o++){var l=n[o];if(l.innerText.includes(t)){r={id:l.getAttribute("id")};break}}return r}String.prototype.replaceAll=function(e,t){return this.split(e).join(t)};'
var watchJs = 'var observer=new MutationObserver(function(e){window.postMessage("reload")});observer.observe(document.querySelector("#MNewsFeed"),{childList:!0});'

class Controller {
  constructor() {
    this.setDataFunction = null;
    this.loadMoreFunction = null;
    this.loadMoreFunction = null;
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

  componentDidMount() {
    //this.makeRemoteRequest();
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

  render() {
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <ListItem
                roundAvatar
                title={`${item.poster.name}`}
                avatar={{ uri: item.poster.picture_url }}
                containerStyle={{ borderBottomWidth: 0 }}
                hideChevron={true}
              />
              <Text>{item.raw_text}</Text>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button title="Like"/>
                <Button title="Comment"/>
                <Button title="Share"/>
              </View>
            </View>
          )}
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
    //this.onMessage = this.onMessage.bind(this);

    /*controller.setLoadMoreFunction(() => {
      this.webview.injectJavaScript('window.scrollTo(0,document.body.scrollHeight)')
    })*/
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
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 20 }} />
        <WebView
          ref={ref => (this.webview = ref)}
          source={{ uri: 'https://m.facebook.com/' }}
          onLoad={this.onLoad}
          //onNavigationStateChange={this.onLoad}
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

export default TabNavigator({
  Timeline: { screen: Real },
  Web: { screen: Web },
});