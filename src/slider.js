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
  attachTo: app
})

// simulate eye blink via keyboard on localhost
document.location.hostname === 'localhost' && window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') store.do('eyeBlink', 'left')
  else if (e.key === 'ArrowRight') store.do('eyeBlink', 'right')
})
