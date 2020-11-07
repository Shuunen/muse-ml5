import Reef from 'reefjs'
import { app } from './app'
import { store } from './store'

export const slider = new Reef('#slider', {
  store,
  template: (props) => `
    <div ${props.status === 'connected' ? '' : 'hidden'}>
      <input type="range" min="1" max="10" value="${props.slider}" class="slider">
      Blink left or right to move the cursor and change the global lighting.
    </div>
  `,
  attachTo: app,
})
