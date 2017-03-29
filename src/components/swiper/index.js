import React, { PropTypes, Component } from 'react';
import { View, ScrollView, Animated } from 'react-native';

import Indicator from '../indicator';
import styles from './styles';

export default class Swiper extends Component {
  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 32,
  };

  static propTypes = {
    ...ScrollView.propTypes,

    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  constructor(props) {
    super(props);

    this.onLayout = this.onLayout.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.progress = 0;

    this.state = {
      width: 0,
      height: 0,
      progress: new Animated.Value(0),
    };
  }

  componentDidUpdate() {
    let { width } = this.state;

    /* Fix scroll position after layout update */
    this.refs.scroll.scrollTo({
      x: Math.floor(this.progress) * width,
      animated: false,
    });
  }

  onLayout(event) {
    let { width, height } = event.nativeEvent.layout;

    this.setState({ width, height });
  }

  onScroll(event) {
    let { x } = event.nativeEvent.contentOffset;
    let { width, progress } = this.state;

    progress.setValue(this.progress = width? x / width : 0);
  }

  render() {
    let { children = [], ...props } = this.props;
    let { width, height, progress } = this.state;

    let pages = [].concat(children)
      .map((child, page) => {
        let { key = page } = child.props;

        return (
          <View style={{ width, height }} key={key}>
            {child}
          </View>
        );
      });

    return (
      <View style={styles.container}>
        <ScrollView
          {...props}
          onLayout={this.onLayout}
          onScroll={this.onScroll}
          ref='scroll'
        >
          {pages}
        </ScrollView>

        <View style={styles.pager}>
          <Indicator index={progress} count={pages.length} />
        </View>
      </View>
    );
  }
}
