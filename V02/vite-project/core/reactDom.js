import React from './react.js'

const reactDom = {
    createRoot(container) {
        return {
            renden(APP) {
                React.renden(APP, container)
            }
        }
    }

}

export default reactDom