let id = 0;
function workLoop(deadline) {
  id++;
  let taskYield = true;
  while (taskYield) {
    taskYield = deadline.timeRemaining() > 0;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
