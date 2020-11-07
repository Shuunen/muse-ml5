import { channelNames, MuseClient } from 'muse-js'
import Reef from 'reefjs'
import { app } from './app'
import { store } from './store'
import { throttle } from './utils'

// eslint-disable-next-line no-new
new Reef('#connection', {
  store,
  template: (props) => `
    <p>Status : ${props.status} ${props.deviceName.length ? `📟 ${props.deviceName}` : ''} ${props.batteryLevel.length ? `🔋 ${props.batteryLevel}%` : ''}</p>
    <button onclick=connect() ${props.status === 'disconnected' ? '' : 'hidden'}>Connect</button>
  `,
  attachTo: app,
})

const client = new MuseClient()
const leftEyeChannel = channelNames.indexOf('AF7')
const rightEyeChannel = channelNames.indexOf('AF8')
const sensorDefaultValue = 1000
const sensorNoiseLevel = 300
const onEyeBlink = side => store.do('eyeBlink', side)
const onEyeBlinkThrottled = throttle(onEyeBlink, 300, { leading: true, trailing: false })

const plot = (data) => {
  const eye = (data.electrode === leftEyeChannel && 'left') || (data.electrode === rightEyeChannel && 'right') || null
  if (!eye) return
  const value = Math.round(Math.max(...data.samples.map(n => Math.abs(n))))
  if (value < sensorNoiseLevel || value === sensorDefaultValue) return
  console.log(`${eye} (${value})`)
  onEyeBlinkThrottled(eye)
}

const onConnected = () => {
  store.do('updateStatus', 'connected')
  store.do('setDeviceName', client.deviceName)
  client.telemetryData.subscribe(data => (store.do('setBatteryLevel', data.batteryLevel.toString())))
  client.eegReadings.subscribe(data => plot(data))
}

window.connect = async () => {
  store.do('updateStatus', 'awaiting for device')
  client.enableAux = true
  let error = await client.connect().catch(e => e.message)
  if (error) return store.do('updateStatus', 'disconnected') && console.error(error)
  store.do('updateStatus', 'getting initial data')
  error = await client.start().catch(e => e.message)
  if (error) return store.do('updateStatus', 'disconnected') && console.error(error)
  onConnected()
}
