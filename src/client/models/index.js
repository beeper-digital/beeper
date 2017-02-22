// TODO: Should be in a shared config
const SEQUENCE_LENGTH = 16


const createSequence = () => [...Array(SEQUENCE_LENGTH)].map(() => ({
  active: false,
  pitch: 60,
  gain: 0.5,
  length: 100,
}))

const createLayer = (nameNumber = 1) => ({
  name: 'Layer ' + nameNumber,
  active: false,
  sequence: createSequence(),
  synthOptions: {
    modWaveForm: 'sine',
    modFrequency: 2.1,
    modOsc1: 15,
    modOsc2: 17,
    filterCutoff: 6000,
    filterQ: 7,
    filterMod: 21,
    filterEnv: 56,
    osc1Wave: 'sawtooth',
    osc1Octave: "32'",
    osc1Detune: 0,
    osc1Mix: 50,
  },
})

module.exports = {
  Layer: {
    create: createLayer,
  },
  Sequence: {
    create: createSequence,
  },
}
