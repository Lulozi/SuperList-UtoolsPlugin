const listInput = document.querySelector(".listInput");
const list = document.querySelector(".list");
const addlistButton = document.querySelector(".addlistButton");

let addTask = function() {
    const taskList = document.createElement("li");
    // 限制输入不超过10个中文字符宽度（英文算半个宽度）
    function getTextWidth(str) {
        let width = 0;
        for (let char of str) {
            // 中文字符范围
            if (/[\u4e00-\u9fa5]/.test(char)) {
                width += 1;
            } else {
                width += 0.5;
            }
        }
        return width;
    }
    const inputValue = listInput.value.trim();
    const width = getTextWidth(inputValue);
    if (width > 10) {
        // 使用字框提示用户，避免 alert 影响体验
        let tip = document.createElement("div");
        tip.textContent = `输入不能超过10个字符的宽度！当前字符数为${width}。`;
        tip.style.position = "absolute";
        tip.style.background = "#fffbe6";
        tip.style.color = "#d48806";
        tip.style.border = "1px solid #ffe58f";
        tip.style.padding = "6px 12px";
        tip.style.borderRadius = "4px";
        tip.style.fontSize = "14px";
        tip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        tip.style.zIndex = "9999";
        // 定位到输入框下方
        const rect = listInput.getBoundingClientRect();
        tip.style.left = rect.left + "px";
        tip.style.top = (rect.bottom + window.scrollY + 6) + "px";
        tip.style.pointerEvents = "none";
        tip.className = "input-tip";
        document.body.appendChild(tip);
        setTimeout(() => {
            tip.remove();
        }, 1800);
        listInput.focus();
        return;
    }
    taskList.innerHTML = `
        <script src="tasks.js"></script>
        <input type="checkbox" class="listCheckbox">
        <label style="transition: text-decoration-color 0.3s, color 0.3s;">${inputValue}</label>
        <button class="trashButton"><div class="trash icon"></div></button>
    `;
    // 为删除按钮添加删除功能
    const trashButton = taskList.querySelector(".trashButton");
    trashButton.addEventListener("click", function(e) {
        e.stopPropagation();
        // 动画淡出
        taskList.style.transition = "opacity 0.3s";
        taskList.style.opacity = "0";
        setTimeout(() => {
            taskList.remove();
        }, 350);
    });
    

    // 为复选框添加选中功能
    const checkbox = taskList.querySelector(".listCheckbox");
    // 记录原始位置
    taskList.dataset.originalIndex = Array.from(list.children).length;

    checkbox.addEventListener("change", function(e) {
        const item = e.target.parentElement;
        const label = item.querySelector("label");
        if (e.target.checked) {
            item.classList.add("checked");
            label.style.textDecoration = "line-through";
            label.style.color = "#999";
            // 等待划线动画结束再移动
            // 先占位，等待动画结束后再整体下移到第一个已勾选项前（或末尾）
            setTimeout(() => {
                const checkedItems = Array.from(list.children).filter(li => li.querySelector(".listCheckbox").checked && li !== item);
                let targetIndex = checkedItems.length > 0 ? Array.from(list.children).indexOf(checkedItems[0]) : list.children.length;
                const itemRect = item.getBoundingClientRect();
                let targetRect;
                if (targetIndex < list.children.length) {
                    targetRect = list.children[targetIndex].getBoundingClientRect();
                } else {
                    // 末尾
                    targetRect = { top: list.getBoundingClientRect().bottom };
                }
                const offsetY = targetRect.top - itemRect.top;
                // 动画时长
                const count = Math.min(list.children.length, 8);
                const duration = Math.max(200, Math.min(400, count * 40));
                console.log('在未勾选项中的目标位置：',taskList.dataset.originalIndex,'所有未勾选项：',uncheckedItems.length);
                // 只有当所选项目不是未选项目的最后一个时才执行
                if (targetIndex - 1 != uncheckedItems.length) {
                    console.log('未勾目标位置：', targetIndex, '所有未勾选项：', uncheckedItems.length);
                    item.style.transition = `transform ${duration}ms linear`;
                    item.style.transform = `translateY(${offsetY}px)`;
                    setTimeout(() => {
                        item.style.transition = "";
                        item.style.transform = "";
                        if (targetIndex < list.children.length) {
                            list.insertBefore(item, list.children[targetIndex]);
                        } else {
                            list.appendChild(item);
                        }
                        // 滑动到底部
                        list.scrollTop = list.scrollHeight;
                    }, duration);
                } else {
                    return;
                }
                
            }, 500); // 500ms等待划线动画结束
        } else {
            item.classList.remove("checked");
            label.style.textDecoration = "none";
            label.style.color = "";
            // 先占位，等待动画结束后再整体上移到最后一个未勾选项后
            setTimeout(() => {
                // 获取所有未勾选项（不含当前item）
                const uncheckedItems = Array.from(list.children).filter(li => !li.querySelector(".listCheckbox").checked && li !== item);
                // 按原始插入顺序排序
                uncheckedItems.push(item);
                uncheckedItems.sort((a, b) => parseInt(a.dataset.originalIndex, 10) - parseInt(b.dataset.originalIndex, 10));
                // 找到当前item在未勾选项中的目标位置
                const targetIndex = uncheckedItems.indexOf(item);
                // 计算目标li
                let beforeLi = null;
                if (targetIndex < uncheckedItems.length - 1) {
                    beforeLi = uncheckedItems[targetIndex + 1];
                }
                const itemRect = item.getBoundingClientRect();
                let targetRect;
                if (beforeLi) {
                    targetRect = beforeLi.getBoundingClientRect();
                }else {
                    targetRect = itemRect;
                }
                console.log('当前item在未勾选项中的目标位置：',targetIndex,'所有未勾选项：',uncheckedItems.length);
                const offsetY = (targetRect.top || itemRect.top) - itemRect.top;
                const count = Math.min(list.children.length, 8);
                const duration = Math.max(200, Math.min(400, count * 40));
                if (targetIndex !== uncheckedItems.length - 1) {
                item.style.transition = `transform ${duration}ms linear`;
                item.style.transform = `translateY(${offsetY}px)`;
                }else {
                    item.style.transform = `translateY(0px)`;   
                }
                // setTimeout(() => {
                //     item.style.transition = "";
                //     item.style.transform = "";
                //     const unchecked = Array.from(list.children).filter(li => !li.querySelector(".listCheckbox").checked);
                //     unchecked.sort((a, b) => parseInt(a.dataset.originalIndex, 10) - parseInt(b.dataset.originalIndex, 10));
                //     // 记录当前item在未勾选项中的新位置
                //     const newIndex = unchecked.indexOf(item);
                //     unchecked.forEach(li => list.insertBefore(li, list.querySelector(".checked") || null));
                //     // 滚动到item原位
                //     if (newIndex !== -1) {
                //         const li = unchecked[newIndex];
                //         li.scrollIntoView({ behavior: "smooth", block: "center" });
                //     }
                // }, duration);
                    setTimeout(() => {
                    item.style.transition = "";
                    item.style.transform = "";

                    // 获取所有未勾选项（不含当前item）
                    const uncheckedItems = Array.from(list.children).filter(li => !li.querySelector(".listCheckbox").checked && li !== item);
                    // 按原始插入顺序排序
                    uncheckedItems.push(item);
                    uncheckedItems.sort((a, b) => parseInt(a.dataset.originalIndex, 10) - parseInt(b.dataset.originalIndex, 10));
                    // 找到当前item在未勾选项中的目标位置
                    const targetIndex = uncheckedItems.indexOf(item);

                    // 预留目标位置：先把item插入到目标位置
                    let beforeLi = null;
                    if (targetIndex < uncheckedItems.length - 1) {
                        beforeLi = uncheckedItems[targetIndex + 1];
                    }
                    if (beforeLi) {
                        list.insertBefore(item, beforeLi);
                    } else {
                        // 插入到未勾选项末尾
                        const checkedLi = Array.from(list.children).find(li => li.querySelector(".listCheckbox").checked);
                        if (checkedLi) {
                            list.insertBefore(item, checkedLi);
                        } else {
                            list.appendChild(item);
                        }
                    }

                    // 执行动画：计算item从原位置到新位置的偏移量
                    const itemRect = item.getBoundingClientRect();
                    const placeholderRect = beforeLi ? beforeLi.getBoundingClientRect() : (list.lastChild ? list.lastChild.getBoundingClientRect() : itemRect);
                    const offsetY = (placeholderRect.top || itemRect.top) - itemRect.top;

                    item.style.transition = `transform ${duration}ms linear`;
                    item.style.transform = `translateY(${offsetY}px)`;

                    // 强制重绘
                    void item.offsetWidth;

                    // 还原transform，触发动画
                    setTimeout(() => {
                        item.style.transform = "";
                    }, 10);

                    // 动画结束后清理
                    setTimeout(() => {
                        item.style.transition = "";
                        item.style.transform = "";
                        // 滚动到item原位
                        item.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, duration + 20);
                }, 250);
            }, 300);
        }
    });

    // 插入到最后一个未勾选项之后
    const uncheckedItems = Array.from(list.children).filter(li => !li.querySelector(".listCheckbox").checked);
    if (uncheckedItems.length > 0) {
        const lastUnchecked = uncheckedItems[uncheckedItems.length - 1];
        list.insertBefore(taskList, lastUnchecked.nextSibling);
    } else {
        list.insertBefore(taskList, list.firstChild);
    }

    listInput.value = ""; // 清空输入框
    listInput.focus(); // 重新聚焦到输入框
}

addlistButton.addEventListener("click", function(e) {
    if (listInput.value.trim() !== "") {
        addTask();
    }
});

listInput.addEventListener("keyup", function(e) {
  if (e.key === "Enter" && listInput.value.trim() !== "") {
    addTask();
  }
});

// 只为新增项目添加过渡动画，不影响勾选/取消勾选时的整体列表移动
function animateNewTask(li) {
    li.style.transition = "transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s";
    li.style.opacity = "0";
    // 计算输入框到li的垂直距离
    const inputRect = listInput.getBoundingClientRect();
    const liRect = li.getBoundingClientRect();
    const offsetY = inputRect.bottom - liRect.top;
    li.style.transform = `translateY(${offsetY}px) scale(0.95)`;
    setTimeout(() => {
        li.style.opacity = "1";
        li.style.transform = "translateY(0) scale(1)";
    }, 10);
    // 清理动画样式
    setTimeout(() => {
        li.style.transition = "";
        li.style.transform = "";
        li.style.opacity = "";
    }, 450);
}

// 修改addTask，在插入新任务后调用动画
const originalAddTask = addTask;
addTask = function() {
    // 先插入
    originalAddTask.apply(this, arguments);
    // 获取刚插入的li（未选中项中最后一个）
    const uncheckedItems = Array.from(list.children).filter(li => !li.querySelector(".listCheckbox").checked);
    if (uncheckedItems.length > 0) {
        animateNewTask(uncheckedItems[uncheckedItems.length - 1]);
    }
};
