import Reef from 'reefjs'
import { app } from './app'
import { store } from './store'

export const slider = new Reef('#slider', {
  store,
  template: (properties) => `
    <div ${properties.status === 'connected' ? '' : 'hidden'}>
      <input type="range" min="1" max="10" value="${properties.slider}" class="slider">
      Blink left or right to move the cursor and change the global lighting.
    </div>
  `,
  attachTo: app,
})
