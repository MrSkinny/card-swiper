import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';

import { DATA_SHAPE } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.40;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {},
    };

    static propTypes = {
        data: PropTypes.arrayOf(DATA_SHAPE).isRequired,
        renderCard: PropTypes.func.isRequired,
        onSwipeLeft: PropTypes.func,
        onSwipeRight: PropTypes.func,
        renderNoMoreCards: PropTypes.func.isRequired,
    };

    state = {
        index: 0,
    };

    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY();

        this.panResponder = PanResponder.create({
            // (return bool) if user presses on screen, be responsible for it
            onStartShouldSetPanResponder: () => true,
            // (cb) called any time user starts dragging around screen
            onPanResponderMove: (_evt, gesture) => {
                this.position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            // (cb) called when finger lets go after dragging
            onPanResponderRelease: (_evt, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            },
        });
    }

    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
        }).start();
    }

    forceSwipe(dir) {
        const x = dir === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
        }).start(() => this.onSwipeComplete(dir));
    }

    onSwipeComplete(dir) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        dir === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }

    getCardStyle() {
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg'],
        });

        return {
            ...this.position.getLayout(),
            transform: [{ rotate }],
        };
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) return this.props.renderNoMoreCards();
        return this.props.data.map((item, i) => {
            if (i < this.state.index) return null;

            if (i === this.state.index) {
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;
