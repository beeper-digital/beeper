const React = require('react')
const _ = require('lodash')

const { bulletin, store, actions } = require('../services')
const { UPDATE_SYNTH } = actions

const ControlInput = require('./control-input')

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
        <ControlInput name="Freq" handleChange={this.handleChange}
          valueName="modFrequency" min="0" max="100" value={this.state.modFrequency} />
        <ControlInput name="Osc1" handleChange={this.handleChange}
          valueName="modOsc1" min="0" max="100" value={this.state.modOsc1} />
        <ControlInput name="Osc2" handleChange={this.handleChange}
          valueName="modOsc2" min="0" max="100" value={this.state.modOsc2} />

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
        <ControlInput name="Detune" handleChange={this.handleChange}
          valueName="osc1Detune" min="-1200" max="1200" value={this.state.osc1Detune} />
        <ControlInput name="Mix" handleChange={this.handleChange}
          valueName="osc1Mix" min="0" max="100" value={this.state.osc1Mix} />

        <p><strong>Filter</strong></p>
        <ControlInput name="Cutoff" handleChange={this.handleChange}
          valueName="filterCutoff" min="20" max="20000" value={this.state.filterCutoff} />
        <ControlInput name="Q" handleChange={this.handleChange}
          valueName="filterQ" min="0" max="20" value={this.state.filterQ} />
        <ControlInput name="Mod" handleChange={this.handleChange}
          valueName="filterMod" min="0" max="100" value={this.state.filterMod} />
        <ControlInput name="Env" handleChange={this.handleChange}
          valueName="filterEnv" min="0" max="100" value={this.state.filterEnv} />
      </div>
    )
  }
}

module.exports = Controls
