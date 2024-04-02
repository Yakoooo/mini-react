
import react from './core/react.js'
import reactDom from './core/reactDom.js'

const APP = react.createElement('div', { id: 'app' }, "hi-react")

//const dom = document.createElement(APP.type)
//dom.id = APP.props.id

//console.log('APP', APP)
//const textEl = document.createTextNode(APP.props.children[0].props.nodeValue)
//console.log('textEl', textEl)
//dom.append(textEl)

reactDom.createRoot(document.querySelector('#root')).render(APP)