import { channelNames, MuseClient } from 'muse-js'
import Reef from 'reefjs'

const connection = new Reef('#connection', {
  data: {
    status: 'unknown',
    deviceName: '',
    batteryLevel: '',
    slider: 5,
    log: ''
  },
  template: (props) => `
    <div ${props.status === 'disconnected' ? '' : 'hidden'}>
      <p>Status : ${props.status}</p>
      <button onclick=connect() ${props.status === 'connected' ? 'hidden' : ''}>Connect</button>
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
client.connectionStatus.subscribe((status) => {
  connection.data.status = status ? 'connected' : 'disconnected'
})

const leftEyeChannel = channelNames.indexOf('AF7')
const rightEyeChannel = channelNames.indexOf('AF8')

let luminosity = 98
const changeLuminosity = (increase = false) => {
  luminosity = increase ? Math.min(luminosity + 10, 100) : Math.max(luminosity - 10, 0)
  document.body.style.backgroundColor = `hsl(0deg 0% ${luminosity}%)`
}

const stackOverflow = name => {
  console.log(`Threshold reached : ${name}`)
  if (name === 'left') connection.data.slider = Math.max(connection.data.slider - 1, 0)
  else if (name === 'right') connection.data.slider = Math.min(connection.data.slider + 1, 10)
  else return
  changeLuminosity(name === 'right')
}

let stack = {}
const overflow = 3
const lifespan = 1000
const stackAdd = (name) => {
  if (!stack[name]) {
    stack[name] = 0 // give life
    setTimeout(() => (delete stack[name]), lifespan) // and plan death
  }
  stack[name]++
  if (stack[name] === overflow) stackOverflow(name)
}

const plot = (data) => {
  const eye = data.electrode === leftEyeChannel && "left" || data.electrode === rightEyeChannel && "right" || null
  if (!eye) return
  const value = Math.round(Math.max(...data.samples.map(n => Math.abs(n))))
  if (value < 300) return
  console.log(`${eye} (${value})`)
  stackAdd(eye)
}

window.connect = async () => {
  console.log('connecting...')
  client.enableAux = true
  await client.connect()
  await client.start()
  connection.data.deviceName = client.deviceName
  client.telemetryData.subscribe(data => (connection.data.batteryLevel = data.batteryLevel.toString()))
  client.eegReadings.subscribe(data => plot(data))
}
