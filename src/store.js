import Reef from 'reefjs'

export const store = new Reef.Store({
  data: {
    status: 'disconnected',
    deviceName: '',
    batteryLevel: '',
    slider: 5
  },
  // once setters are defined, this is the only way to update above data
  setters: {
    updateStatus (props, status) {
      props.status = status
    },
    setDeviceName (props, name) {
      props.deviceName = name
    },
    setBatteryLevel (props, level) {
      props.batteryLevel = level
    },
    eyeBlink (props, side) {
      props.slider = Math.min(Math.max(side === 'right' ? props.slider + 1 : props.slider - 1, 0), 10)
      updateLuminosity()
    }
  }
})

const updateLuminosity = () => {
  const l = store.data.slider * 10
  console.log('updateLuminosity', l)
  document.body.style.backgroundColor = `hsl(0deg 0% ${l - 10}%)`
  document.body.style.color = `hsl(0deg 0% ${140 - l}%)`
}

updateLuminosity()
