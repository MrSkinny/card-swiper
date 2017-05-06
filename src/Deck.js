import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Animated,
    Text,
} from 'react-native';

const propTypes = {
    data: PropTypes.array.isRequired,
    renderCard: PropTypes.func.isRequired,
};

class Deck extends Component {
    renderCards() {
        return this.props.data.map(item => this.props.renderCard(item));
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
