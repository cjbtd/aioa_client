// @ts-nocheck
import type { ObjectDirective, DirectiveBinding } from "vue";

class Print {
  dom: HTMLElement | null;
  iframeId: string = "print_area_" + new Date().getTime();
  canvasClass = "print_area_canvas_2_img";

  constructor(id: string) {
    this.dom = document.getElementById(id);

    this.init();
  }

  init() {
    if (this.dom) {
      const win = document.createElement("iframe");
      document.body.appendChild(win);
      try {
        win.setAttribute("id", this.iframeId);
        win.style.display = "none";
        win.onload = () => this.print(win.contentWindow);

        this.write(win.contentDocument);
      } catch (e) {
        alert(e);
      }
    } else {
      window.print();
    }
  }
  print(win: Window | null) {
    if (win) {
      win.focus();
      win.print();
    }

    this.clear();
  }
  clear() {
    let iframe = document.getElementById(this.iframeId);
    if (iframe) iframe?.parentNode?.removeChild(iframe);

    this.dom.querySelectorAll("." + this.canvasClass).forEach((node) => {
      if (node.tagName.toLowerCase() === "img") {
        node?.parentNode?.removeChild(node);
      } else {
        node.style.display = "block";
      }
    });
  }
  write(doc: Document | null) {
    if (doc) {
      doc.open();
      doc.write(`<!DOCTYPE html><html>${this.head()}${this.body()}</html>`);
      doc.close();
    }
  }
  head() {
    return `<head><title></title><link rel="stylesheet" href="/static/print.css"></head>`;
  }
  body() {
    this.dom.querySelectorAll("canvas").forEach((node) => {
      if (node.style.display !== "none") {
        let url = node.toDataURL();
        let img = new Image();

        img.src = url;
        img.style = node.style;
        img.className = this.canvasClass;
        
        node.className += this.canvasClass;
        node?.parentNode?.appendChild(img);
        node.style.display = "none";
      }
    });

    let dom = this.dom.cloneNode(true);
    let selectCount = -1;

    dom.querySelectorAll("input,select,textarea").forEach((node) => {
      if (node.tagName === "INPUT") {
        if (["radio", "checkbox"].indexOf(node.getAttribute("type")) >= 0) {
          node.checked && node.setAttribute("checked", node.checked);
        } else {
          node.setAttribute("value", node.value);
        }
      }

      if (node.tagName === "SELECT") {
        selectCount++;
        for (let i = 0; i < this.dom.querySelectorAll("select").length; i++) {
          let select = this.dom.querySelectorAll("select")[i];
          !select.getAttribute("newbs") && select.setAttribute("newbs", i + "");
          if (select.getAttribute("newbs") === selectCount + "") {
            let opSelectedIndex =
              this.dom.querySelectorAll("select")[selectCount].selectedIndex;
            node.options[opSelectedIndex].setAttribute("selected", true);
          }
        }
      }

      if (node.tagName === "TEXTAREA") {
        node.innerHTML = node.value;
        node.setAttribute("html", node.value);
      }
    });

    return "<body>" + dom.outerHTML + "</body>";
  }
}

/**
 * @file print dom
 * @method v-print:[id]
 * @param id: Get dom by id to print, default is window
 */
const print: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const id = binding.arg;
    // const opts = binding.value;

    el.addEventListener("click", () => new Print(id));
  },
};

export default print;
