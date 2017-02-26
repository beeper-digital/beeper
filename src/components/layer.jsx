const React = require('react')
const { store } = require('../services')

const Tile = require('./tile')

const {
  ACTIVATE_LAYER,
  CHANGE_MODE,
  MUTE_LAYER,
} = require('../services/actions')

class Layer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      muted: false,
    }
    this.selectLayer = this.selectLayer.bind(this)
    this.muteLayer = this.muteLayer.bind(this)

    store.subscribe(() => {
      let active = store.getState().getIn(['layers', this.props.layerNumber, 'active'])
      let muted = store.getState().getIn(['layers', this.props.layerNumber, 'muted'])
      console.log('is muted?', muted)
      this.setState({ active, muted })
    })
  }

  selectLayer() {
    console.log('SELECT LAYER')
    store.dispatch({
      type: ACTIVATE_LAYER,
      value: this.props.layerNumber,
    })
    store.dispatch({
      type: CHANGE_MODE,
      value: 'note',
    })
  }

  muteLayer() {
    console.log('muteLayer')
    store.dispatch({
      type: MUTE_LAYER,
      layer: this.props.layerNumber,
      value: !this.state.muted,
    })
  }

  render() {
    const tiles = this.props.layer.sequence.map((item, index) =>
      <Tile sequenceNum={index} key={index} layer={this.props.layerNumber} />
    )
    return (
      <div style={{top: this.props.layerNumber * 100, zIndex: 999 - this.props.layerNumber}}
        className={"layer clearfix " + (this.state.active ? 'active' : '')}>
        <div onClick={this.selectLayer} className="layer__mask"></div>
        {tiles}
        <button className="mute-btn toolbar__button" onClick={this.muteLayer}>
          <i className={'fa fa-volume-' + (this.state.muted ? 'off' : 'up')} aria-hidden="true"></i>
        </button>
      </div>
    )
  }
}

module.exports = Layer
