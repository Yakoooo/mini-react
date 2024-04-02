const createElement = (type, props, ...children) => {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child == "string" ? createTextNode(child) : child;
      }),
    },
  };
};
const createTextNode = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

//利用render创建VDOm
const render = (el, root) => {
  WorkUnit = {
    dom: root,
    props: {
      children: [el],
    },
  };
};

let WorkUnit = null;
function workLoop(deadline) {
  let taskYield = true;
  while (taskYield && WorkUnit) {
    //空闲时间去执行下一个渲染任务 - 并且返回下一个任务
    WorkUnit = preFormWorkOfUnit(WorkUnit);
    console.log(WorkUnit);
    taskYield = deadline.timeRemaining() > 0;
  }
  requestIdleCallback(workLoop);
}

const createDom = (type) => {
  return type == "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
};

const upDataProps = (dom, props) => {
  Object.keys(props).forEach((keys) => {
    if (keys !== "children") {
      dom[keys] = props[keys];
    }
  });
};

const initChildren = (work) => {
  let preWork = null;
  work.props.children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      dom: null,
      parent: work,
      siding: null,
      child: null,
    };
    if (index === 0) {
      work.child = newWork;
    } else {
      preWork.siding = newWork;
    }
    preWork = newWork;
  });
};

// 执行任务将当前的任务执行起来
function preFormWorkOfUnit(work) {
  //1.创建Dom
  if (!work.dom) {
    const dom = (work.dom = createDom(work.type));
    work.parent.dom.append(dom);

    //2.处理props 挂载到 dom 上
    upDataProps(dom, work.props);
  }

  //3 组成数据链接(按平级的数据链去算，就是只组成下一级的数据链。后续根据作用域会自己补齐)
  //3.1 链表的特点就是有父节点和子节点就能链接到一切节点
  //3.2 链表继承vDom的所有东西
  initChildren(work);

  //4.返回下一个任务
  if (work.child) {
    return work.child;
  }
  if (work.siding) {
    return work.siding;
  }
  return work.parent?.siding;
}

requestIdleCallback(workLoop); //查询任务调度中的空闲时间

const React = {
  render,
  createElement,
};

export default React;
