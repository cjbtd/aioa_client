import type { ObjectDirective, DirectiveBinding } from "vue";
import { nextTick } from "vue";
/**
 * @file drag dom
 * @method v-drag:[className]="'dragClassName'"
 * @param className: Get dom by class name to drag, default is current dom(el)
 * @param dragClassName: Area that can be dragged, default is full dom
 * @description Use nextTick due to teleport
 */
const drag: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const className = binding.arg;
    const dragClassName = binding.value;

    nextTick(() => {
      const dragDom: HTMLElement = className
        ? window.document.querySelector("." + className) || el
        : el;
      const dragArea: HTMLElement = dragClassName
        ? dragDom.querySelector("." + dragClassName) || dragDom
        : dragDom;

      const transform = { offsetLeft: 0, offsetTop: 0 };

      dragArea.style.cssText += ";cursor:move;";

      dragArea.onmousedown = (downE) => {
        let left = 0,
          top = 0;

        document.onmousemove = (moveE) => {
          window.getSelection()?.removeAllRanges();

          left = moveE.clientX - downE.clientX + transform.offsetLeft;
          top = moveE.clientY - downE.clientY + transform.offsetTop;

          dragDom.style.transform = `translate(${left}px, ${top}px)`;
        };

        document.onmouseup = () => {
          transform.offsetLeft = left;
          transform.offsetTop = top;

          document.onmousemove = document.onmouseup = null;
        };
      };
    });
  },
};
export default drag;
