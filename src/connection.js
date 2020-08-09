import { channelNames, MuseClient } from 'muse-js'
import Reef from 'reefjs'
import { throttle } from './utils'

const connection = new Reef('#connection', {
  data: {
    status: 'disconnected',
    deviceName: '',
    batteryLevel: '',
    slider: 5,
    log: ''
  },
  template: (props) => `
    <div ${props.status !== 'connected' ? '' : 'hidden'}>
      <p>Status : ${props.status}</p>
      <button onclick=connect() ${props.status === 'disconnected' ? '' : 'hidden'}>Connect</button>
    </div>
    <div ${props.status === 'connected' ? '' : 'hidden'}>
      <p>Status : ${props.status} ${props.deviceName.length ? `📟 ${props.deviceName}` : ''} ${props.batteryLevel.length ? `🔋 ${props.batteryLevel}%` : ''}</p>
      <input type="range" min="1" max="10" value="${props.slider}" class="slider">
      Blink left or right to move the cursor and change the global lighting.
    </div>
  `,
  attachTo: window.app
})

const client = new MuseClient()

const leftEyeChannel = channelNames.indexOf('AF7')
const rightEyeChannel = channelNames.indexOf('AF8')

const updateLuminosity = () => {
  const l = connection.data.slider * 10
  console.log('updateLuminosity', l)
  document.body.style.backgroundColor = `hsl(0deg 0% ${l}%)`
  document.body.style.color = `hsl(0deg 0% ${130 - l}%)`
}

const onEyeBlink = side => {
  console.log(`Threshold reached : ${side}`)
  if (side === 'left') connection.data.slider = Math.max(connection.data.slider - 1, 0)
  else if (side === 'right') connection.data.slider = Math.min(connection.data.slider + 1, 10)
  else return
  updateLuminosity()
}

const onEyeBlinkThrottled = throttle(onEyeBlink, 300, { leading: true, trailing: false })

const plot = (data) => {
  const eye = data.electrode === leftEyeChannel && "left" || data.electrode === rightEyeChannel && "right" || null
  if (!eye) return
  const value = Math.round(Math.max(...data.samples.map(n => Math.abs(n))))
  if (value < 300) return
  console.log(`${eye} (${value})`)
  onEyeBlinkThrottled(eye)
}

window.connect = async () => {
  connection.data.status = 'awaiting for device'
  client.enableAux = true
  let error = await client.connect().catch(e => e.message)
  if (error) return (connection.data.status = 'disconnected') && console.error(error)
  connection.data.status = 'getting initial data'
  error = await client.start().catch(e => e.message)
  if (error) return console.error(error)
  connection.data.status = 'connected'
  updateLuminosity()
  connection.data.deviceName = client.deviceName
  client.telemetryData.subscribe(data => (connection.data.batteryLevel = data.batteryLevel.toString()))
  client.eegReadings.subscribe(data => plot(data))
}
