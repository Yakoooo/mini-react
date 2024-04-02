import React from './react.js'

const reactDom = {
    createRoot(container) {
        return {
            render(APP) {
                React.render(APP, container)
            }
        }
    }

}

export default reactDom