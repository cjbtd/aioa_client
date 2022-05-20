import { ElMessage, ElMessageBox } from "element-plus";
import { _T } from ".";

const socket: {
  timeout: number;
  timer: null | NodeJS.Timer;
  handleFuncs: Record<string, Function>;
  send(): void;
  reset(): void;
  heartbeat(): void;
} = {
  timeout: 5,
  timer: null,
  handleFuncs: {},
  send() {
    fetch("/api/chat/heartbeat", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 0) {
          socket.reset();

          ElMessageBox.alert(_T("_T0088"), _T("_T0019"), {
            type: "warning",
            draggable: true,
            lockScroll: false,
            dangerouslyUseHTMLString: true,
            confirmButtonText: _T("_T0020"),
          });

          return false;
        }

        if (res.message) {
          let message = res.message;
          let func = socket.handleFuncs[message.func];
          if (func && message.body) func(message.body);

          if (message.msg) {
            if (message.msg === "[admin]reload") {
              ElMessageBox.confirm(_T("_T0024"), _T("_T0023"), {
                type: "warning",
                confirmButtonText: _T("_T0026"),
                cancelButtonText: _T("_T0025"),
                closeOnClickModal: false,
              }).then(() => {
                window.location.reload();
              });
            } else {
              ElMessage({
                type: "warning",
                grouping: true,
                duration: 0,
                offset: 60,
                showClose: true,
                message: message.msg,
                dangerouslyUseHTMLString: true,
              });
            }
          }
        }
      });
  },
  reset() {
    if (socket.timer) clearInterval(socket.timer);
    return false;
  },
  heartbeat() {
    socket.reset();
    socket.timer = setInterval(() => {
      try {
        socket.send();
      } catch (e) {
        socket.reset();
        alert(e);
      }
    }, socket.timeout * 1000);
  },
};

export default socket;
