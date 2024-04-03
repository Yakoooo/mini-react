const createElement = (type, props, ...children) => {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode = typeof child == "string" || typeof child == "number";
        return isTextNode ? createTextNode(child) : child;
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
const render = (el, control) => {
  WorkUnit = {
    dom: control,
    props: {
      children: [el],
    },
  };
  root = WorkUnit;
};

let root = null;
let WorkUnit = null;
function workLoop(deadline) {
  let taskYield = true;
  while (taskYield && WorkUnit) {
    //空闲时间去执行下一个渲染任务 - 并且返回下一个任务
    WorkUnit = preFormWorkOfUnit(WorkUnit);
    taskYield = deadline.timeRemaining() > 0;
  }
  // console.log("WorkUnit", WorkUnit, root);
  if (!WorkUnit && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

//统一提交 防止渲染断断续续的
function commitRoot() {
  commitWork(root.child);
  root = null;
}
//递归任务挂载
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.siding);
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

//3 组成数据链接(按平级的数据链去算，就是只组成下一级的数据链。后续根据作用域会自己补齐)
//3.1 链表的特点就是有父节点和子节点就能链接到一切节点 这里是靠子节点-父节点和兄弟节点
//3.2 链表继承vDom的所有东西
const initChildren = (work, children) => {
  let preWork = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      dom: null,
      parent: work,
      siding: null,
      child: null,
    };
    if (index === 0) {
      work.child = newWork; //子节点的添加靠子节点自己添加
    } else {
      preWork.siding = newWork;
    }
    preWork = newWork;
  });
};

function upDataFunctionComponent(work) {
  const children = [work.type(work.props)];
  initChildren(work, children);
}
function upDataHookComponent(work) {
  if (!work.dom) {
    const dom = (work.dom = createDom(work.type));
    // work.parent.dom.append(dom);
    //2.处理props 挂载到 dom 上
    upDataProps(dom, work.props);
  }
  const children = work.props.children;

  initChildren(work, children);
}

// 执行任务将当前的任务执行起来
function preFormWorkOfUnit(work) {
  const isFunctionComponent = typeof work.type === "function";

  //1 创建Dom
  //1.1 组件函数是不需要创建dom的
  if (isFunctionComponent) {
    upDataFunctionComponent(work);
  } else {
    upDataHookComponent(work);
  }

  //4.返回下一个任务
  if (work.child) {
    return work.child;
  }

  let nextSiding = work;
  while (nextSiding) {
    if (nextSiding.siding) return nextSiding.siding;
    nextSiding = nextSiding.parent;
  }
}

requestIdleCallback(workLoop); //查询任务调度中的空闲时间

const React = {
  render,
  createElement,
};

export default React;
