const WM_CLASS_NAME = "__watermark";

export default function watermark(
  settings: null | string | object = null,
  dom: string | HTMLElement = document.body
) {
  let _ = {
    wm_txt: "Controlled Data",
    wm_width: 180,
    wm_height: 60,
    wm_x_space: 30,
    wm_y_space: 30,
    wm_angle: "20",
    wm_color: "#aaa",
    wm_opacity: "0.4",
    wm_fontsize: "20px",
  };

  if (typeof dom === "string")
    dom = document.getElementById(dom) || document.body;

  let wm_dom = dom.getElementsByClassName(WM_CLASS_NAME);

  while (wm_dom[0]) {
    wm_dom[0].parentNode?.removeChild(wm_dom[0]);
  }

  if (!settings) {
    return false;
  } else if (typeof settings === "string") {
    _.wm_txt = settings;
  } else {
    Object.assign(_, settings);
  }

  let frag = document.createDocumentFragment();
  let x_offset = _.wm_width + _.wm_x_space;
  let y_offset = _.wm_height + _.wm_y_space;
  let rows = (dom.offsetWidth + _.wm_width) / x_offset - 1;
  let cols = (dom.offsetHeight + _.wm_height) / y_offset + 1;

  for (let i = 0; i <= rows; i++) {
    let x = x_offset * i;
    for (let j = 0; j <= cols; j++) {
      let y = y_offset * j;

      let wm_div = document.createElement("div");
      wm_div.style.top = y + "px";
      wm_div.style.left = x + "px";
      wm_div.style.zIndex = "99999";
      wm_div.style.display = "block";
      wm_div.style.overflow = "hidden";
      wm_div.style.position = "absolute";
      wm_div.style.textAlign = "center";
      wm_div.style.fontFamily = "微软雅黑";
      wm_div.style.pointerEvents = "none";
      wm_div.style.color = _.wm_color;
      wm_div.style.width = _.wm_width + "px";
      wm_div.style.height = _.wm_height + "px";
      wm_div.style.opacity = _.wm_opacity;
      wm_div.style.fontSize = _.wm_fontsize;
      wm_div.style.transform = "rotate(-" + _.wm_angle + "deg)";
      wm_div.appendChild(document.createTextNode(_.wm_txt));
      wm_div.className = WM_CLASS_NAME;
      frag.appendChild(wm_div);
    }
  }
  dom.appendChild(frag);
}
