
import React from './core/React.js'
//自动调用craete 创建一个虚拟的DOM

const handleClick = () => {
    console.log('click');
}

function Counter({name}) {
    return (<div>name:{name} <button onclick={handleClick}>button</button> </div>);
}

const APP = (<div> hi react <Counter name={10}></Counter> <Counter name={20}></Counter> </div>)



export default APP