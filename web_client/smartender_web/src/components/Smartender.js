import React, { Component } from 'react';

class Smartender extends Component {
    render() {
        return (
            <div>
                <button onClick={this.props.getSmartenders}>Get Smartenders</button>
            </div>
        );
    }
}

export default Smartender;