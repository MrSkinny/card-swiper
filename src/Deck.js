import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Animated,
    PanResponder,
} from 'react-native';

const propTypes = {
    data: PropTypes.array.isRequired,
    renderCard: PropTypes.func.isRequired,
};

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
            onPanResponderRelease: () => {},
        });
    }

    getCardStyle() {
        const rotate = this.position.x.interpolate({
            inputRange: [-500, 0, 500],
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
