const createElement = (type, props, ...chilren) => {
    return {
        type: type,
        props: {
            ...props,
            chilren: chilren.map((child) => {
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
            chilren: []
        },
    }
}

//利用renden创建VDOm
const renden = (el, root) => {
    const dom = el.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type);

    Object.keys(el.props).forEach((keys) => {
        if (keys !== "chilren") {
            dom[keys] = el.props[keys]
        }
    })

    const chilren = el.props.chilren
    chilren.forEach((item => {
        renden(item, dom)
    }))

    root.append(dom)
}

const React = {
    renden,
    createElement
}

export default React