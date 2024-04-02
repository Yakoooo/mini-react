
import React from './core/react.js'
//自动调用craete 创建一个虚拟的DOM
function Counter() {
    return (<div>counter</div>);
}

const APP = (<div> hi react <Counter></Counter> </div>)

export default APP