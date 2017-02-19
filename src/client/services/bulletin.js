const channels = {}

exports.subscribe = (channel, fn) => {
  if (!channels[channel]) {
    channels[channel] = []
  }

  channels[channel].push(fn)
}

exports.publish = (channel, data) => {
  if (!channels[channel]) {
    return
  }

  channels[channel].forEach(fn => {
    fn(data)
  })
}
