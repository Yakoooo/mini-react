const createElement = (type, props, ...children) => {
    return {
        type: type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child == 'string' ? createTextNode(child) : child
            })
        },
    }
}
const createTextNode = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        },
    }
}

//利用render创建VDOm
const render = (el, root) => {
    const dom = el.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type);

    Object.keys(el.props).forEach((keys) => {
        if (keys !== "children") {
            dom[keys] = el.props[keys]
        }
    })

    const children = el.props.children
    children.forEach((item => {
        render(item, dom)
    }))

    root.append(dom)
}

const React = {
    render,
    createElement
}

export default React