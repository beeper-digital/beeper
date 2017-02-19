const React = require('react')
const ReactDOM = require('react-dom')

console.log(React)

const audioContext = new AudioContext()
const Synthesizer = require('./synth/synthesizer')

const { Beeper } = require('./components')
const { store, bulletin, actions } = require('./services')

const { UPDATE_SYNTH } = actions

const SEQUENCE_LENGTH = 16
let currentStep = 0
const BPM = 120
const synthMap = [new Synthesizer(audioContext)]

ReactDOM.render(
  <Beeper />,
  document.getElementById('root')
)

console.log(store.getState().toJS())

store.subscribe(() => {
  const layers = store.getState().get('layers').toJS()
  layers.forEach((layer, index) => {
    if (!synthMap[index]) {
      synthMap[index] = new Synthesizer(audioContext)
    }
  })
})

bulletin.subscribe(UPDATE_SYNTH, (data) => {
  switch (data.prop) {
    case 'filterCutoff':
      synthMap[data.layer].updateFilterCutoff(data.value)
      break
    case 'filterQ':
      synthMap[data.layer].updateFilterQ(data.value)
      break
    case 'filterMod':
      synthMap[data.layer].updateFilterMod(data.value)
      break
    case 'filterEnv':
      synthMap[data.layer].updateFilterEnv(data.value)
      break

    case 'modWaveForm':
      synthMap[data.layer].updateModWaveform(data.value)
      break
    case 'modFrequency':
      synthMap[data.layer].updateModFrequency(data.value)
      break
    case 'modOsc1':
      synthMap[data.layer].updateModOsc1(data.value)
      break
    case 'modOsc2':
      synthMap[data.layer].updateModOsc2(data.value)
      break

  }
})

const tick = () => {
  bulletin.publish('heartbeat', currentStep)

  let layers = store.getState().get('layers').toJS()

  layers.forEach((layer, layerIndex) => {
    if (layer.sequence[currentStep].active) {
      let { pitch, gain, length } = layer.sequence[currentStep]
      // Add the zero to create a new variable instead of a reference
      pitch = pitch + 0

      synthMap[layerIndex].noteOn(pitch, gain)

      setTimeout(() => synthMap[layerIndex].noteOff(pitch), length)
    }
  })

  currentStep++
    if (currentStep >= SEQUENCE_LENGTH) {
    currentStep = 0
  }
}

setInterval(() => {
  tick()
}, 60000 / (BPM * 4))

