import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';

const propTypes = {
    data: PropTypes.array.isRequired,
    renderCard: PropTypes.func.isRequired,
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.40;

class Deck extends Component {
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
                    console.log('swipe right!');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    console.log('swipe left!');
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
        return this.props.data.map((item, index) => {
            if (index === 0) {
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
        const { renderNoMoreCards, data, onSwipeRight, onSwipeLeft } = this.props;
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

Deck.propTypes = propTypes;

export default Deck;
