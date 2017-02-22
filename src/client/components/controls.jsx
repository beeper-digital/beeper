const React = require('react')
const _ = require('lodash')

const { bulletin, store, actions } = require('../services')
const { UPDATE_SYNTH } = actions

class Controls extends React.Component {
  constructor(props) {
    super(props)

    let layers = store.getState().get('layers').toJS()
    let activeLayer = _.find(layers, { active: true })
    if (!activeLayer) {
      activeLayer = layers[0]
    }
    this.state = _.assign({ active: false }, activeLayer.synthOptions)

    store.subscribe(() => {
      let mode = store.getState().get('mode')
      let layers = store.getState().get('layers').toJS()
      let activeLayer = _.find(layers, { active: true })
      if (!activeLayer) {
        activeLayer = layers[0]
      }
      this.setState(_.assign(
        { active: mode === 'controls' },
        activeLayer.synthOptions
      ))
    })

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event, prop) {
    let layers = store.getState().get('layers').toJS()
    let activeLayer = _.findIndex(layers, { active: true })
    if (activeLayer < 0) {
      activeLayer = 0
    }

    let value = event.target.tagName === 'SELECT' ?
      event.target.value :
      parseInt(event.target.value, 10)

    bulletin.publish(UPDATE_SYNTH, {
      prop,
      layer: activeLayer,
      value,
    })
    store.dispatch({
      type: UPDATE_SYNTH,
      prop,
      layer: activeLayer,
      value,
    })
  }

  render() {
    return (
      <div className={"controls " + (this.state.active ? 'active' : '')}>
        <p><strong>Mod</strong></p>
        <div className="controls__section">
          <label>waveform</label>
          <select onChange={(e) => this.handleChange(e, 'modWaveForm')}
            value={this.state.modWaveForm}>
            <option>sine</option>
            <option>square</option>
            <option>sawtooth</option>
            <option>triangle</option>
          </select>
        </div>
        <div className="controls__section">
          <label>Freq</label>
          <input onChange={(e) => this.handleChange(e, 'modFrequency')} value={this.state.modFrequency} min="0" max="100" type="range" />
        </div>
        <div className="controls__section">
          <label>Osc1</label>
          <input onChange={(e) => this.handleChange(e, 'modOsc1')} value={this.state.modOsc1} min="0" max="100" type="range" />
        </div>
        <div className="controls__section">
          <label>Osc2</label>
          <input onChange={(e) => this.handleChange(e, 'modOsc2')} value={this.state.modOsc2} min="0" max="100" type="range" />
        </div>

        <p><strong>Osc1</strong></p>
        <div className="controls__section">
          <label>waveform</label>
          <select onChange={(e) => this.handleChange(e, 'osc1Wave')}
            value={this.state.osc1Wave}>
            <option>sine</option>
            <option>square</option>
            <option>sawtooth</option>
            <option>triangle</option>
          </select>
        </div>
        <div className="controls__section">
          <label>octave</label>
          <select onChange={(e) => this.handleChange(e, 'osc1Octave')}
            value={this.state.osc1Octave}>
            <option value="32'">32</option>
            <option value="16'">16</option>
            <option value="8'">8</option>
          </select>
        </div>
        <div className="controls__section">
          <label>Detune</label>
          <input onChange={(e) => this.handleChange(e, 'osc1Detune')} value={this.state.osc1Detune} min="-1200" max="1200" type="range" />
        </div>

        <div className="controls__section">
          <label>Mix</label>
          <input onChange={(e) => this.handleChange(e, 'osc1Mix')} value={this.state.osc1Mix} min="0" max="100" type="range" />
        </div>


        <p><strong>Filter</strong></p>
        <div className="controls__section">
          <label>Cutoff</label>
          <input onChange={(e) => this.handleChange(e, 'filterCutoff')} value={this.state.filterCutoff} min="20" max="20000" type="range" />
        </div>
        <div className="controls__section">
          <label>Q</label>
          <input onChange={(e) => this.handleChange(e, 'filterQ')} value={this.state.filterQ} min="0" max="20" type="range" />
        </div>
        <div className="controls__section">
          <label>Mod</label>
          <input onChange={(e) => this.handleChange(e, 'filterMod')} value={this.state.filterMod} min="0" max="100" type="range" />
        </div>
        <div className="controls__section">
          <label>Env</label>
          <input onChange={(e) => this.handleChange(e, 'filterEnv')} value={this.state.filterEnv} min="0" max="100" type="range" />
        </div>
      </div>
    )
  }
}

module.exports = Controls
