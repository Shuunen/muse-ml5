import Reef from 'reefjs'

export const app = new Reef('#app', {
  template: () => `
    <div id=connection></div>
    <div id=slider></div>
    <div id=illustration></div>
  `
})
