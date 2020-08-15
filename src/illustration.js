import Reef from 'reefjs'
import { app } from './app'
import { store } from './store'

export const illustration = new Reef('#illustration', {
  store,
  template: (props) => `
    <style>
    #illustration { display: ${props.status === 'connected' ? 'block' : 'none'}; }
    .ring { background-position-x: ${-68 + props.slider * 40}px; }
    .finger { filter: grayscale(${props.slider === 0 ? 1 : 1 / props.slider}) blur(${props.slider === 0 ? 5 : 5 - Math.round(props.slider / 2)}px); }
    </style>
    <div class="illustration ring ring-top"></div>
    <div class="illustration finger"></div>
    <div class="illustration ring ring-bot"></div>
    <p ${props.slider < 3 ? '' : 'hidden'} style="font-size: ${40 + props.slider * 10}px; color: darkorange; font-family: fantasy; position: absolute; top: 150px; z-index: 20;">Will you marry me ?</p>
    <p ${props.slider < 2 ? '' : 'hidden'} style="position: absolute;bottom: 0;font-style: italic;opacity: .5;">Blink left or right to move the wedding ring.</p>
    <p ${props.slider < 8 ? 'hidden' : ''} style="color: darkblue; font-size: 60px; transform: rotate(-15deg); position: absolute; bottom: 20px;">Mazel tov 💕</p>
  `,
  attachTo: app
})
