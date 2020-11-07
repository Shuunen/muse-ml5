import Reef from 'reefjs'

export const store = new Reef.Store({
  data: {
    status: 'disconnected',
    deviceName: '',
    batteryLevel: '',
    slider: 0,
  },
  // once setters are defined, this is the only way to update above data
  setters: {
    updateStatus (properties, status) {
      properties.status = status
    },
    setDeviceName (properties, name) {
      properties.deviceName = name
    },
    setBatteryLevel (properties, level) {
      properties.batteryLevel = level
    },
    eyeBlink (properties, side) {
      properties.slider = Math.min(Math.max(side === 'right' ? properties.slider + 1 : properties.slider - 1, 0), 10)
      updateLuminosity()
    },
  },
})

const updateLuminosity = () => {
  const l = store.data.slider * 10
  console.log('updateLuminosity', l)
  document.body.style.backgroundColor = `hsl(0deg 0% ${l - 10}%)`
  document.body.style.color = `hsl(0deg 0% ${140 - l}%)`
}

updateLuminosity()

// simulate eye blink via keyboard on localhost
document.location.hostname === 'localhost' && window.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') store.do('eyeBlink', 'left')
  else if (event.key === 'ArrowRight') store.do('eyeBlink', 'right')
})
