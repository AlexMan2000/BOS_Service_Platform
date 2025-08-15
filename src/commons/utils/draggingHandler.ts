/** --------------- Solving Dragging Functionalities ---------------- */
export function elemDrag (elem) {
    let x,
        y
  
    addEvent(elem, 'mousedown', function (e) {
      let ev = e || window.event
  
      x = pagePos(ev).X - parseInt(getStyles(elem, 'left'))
      y = pagePos(ev).Y - parseInt(getStyles(elem, 'top'))
  
      addEvent(document, 'mousemove', mouseMove)
      addEvent(document, 'mouseup', mouseUp)
    })
  
  
    function mouseMove (e) {
      var e = e || window.event
      elem.style.top = pagePos(e).Y - y + 'px'
      elem.style.left = pagePos(e).X - x + 'px'
      cancelBubble(e)
      preventDefaultEvent(e)
    }
  
  
    function mouseUp (e) {
      var e = e || window.event
      removeEvent(document, 'mousemove', mouseMove)
      removeEvent(document, 'mouseup', mouseUp)
      cancelBubble(e)
      preventDefaultEvent(e)
    }
  }

// mouse coordinate (x, y) relative to the document
export function pagePos(e) {
const sLeft = getScrollOffset().left,
        sTop = getScrollOffset().top,
        // offset, for some old browser engines
        cLeft = document.documentElement.clientLeft || 0,
        cTop = document.documentElement.clientTop || 0;

return {
    X: e.clientX + sLeft - cLeft,
    Y: e.clientY + sTop - cTop
}
}

// Get scroll distance
export function getScrollOffset() {
return {
    left: document.body.scrollLeft + document.documentElement.scrollLeft,
    top: document.body.scrollTop + document.documentElement.scrollTop
} 
}



/** ---------------- Getting Styles functionalites ----------*/
export function getStyles (elem, prop) {
    // Chrome or IE 8 and above
    if (window.getComputedStyle) {
      // If prop, return that styles.
      if (prop) {
        return window.getComputedStyle(elem, null)[prop]
      } else {
        return window.getComputedStyle(elem, null)
      }
    } else {
      // IE8
      if (prop) {
        return elem.curentStyle[prop]
      } else {
        return elem.curentStyle
      }
    }
}


/** ----------------- Register/Unregister Events ------------- */
// 兼容性封装, el:元素，type是事件类型, fn是事件处理函数
export function addEvent (el, type, fn) {
    // 如果是Chrome或IE8以上
    if (el.addEventListener) {
      el.addEventListener(type, fn, false)
    // 如果是IE8及以下
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, function () {
        fn.call(el) //改变this指向， 使得fn中的this指向元素本身
      })
    // 如果都不是
    } else {
      el['on' + type] = fn
    }
  }


  export function removeEvent(elem,type,fn){
    if(elem.addEventListener){
      elem.removeEventListener(type, fn, false);  
    }else if(elem.attachEvent){
      elem.detachEvent('on'+type,fn)
    }else{
      elem['on' + 'type'] = null;
    }
  }


  // IE兼容性封装
export function cancelBubble (e) {
    var e = e || window.event
    // w3c规范方法
    if (e.stopPropagation) {
      e.stopPropagation()
    // IE兼容方式
    } else {
      e.cancelBubble = true;
    }
  }


export function preventDefaultEvent(e) {
// IE8兼容性
var e = e || window.event

// w3c标准
if (e.preventDefault) {
    e.preventDefault()
// IE9及以下兼容
} else {
    e.returnValue = false
}
}