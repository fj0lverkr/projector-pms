/***
this requires jquery.toast to be loaded first:
https://github.com/kamranahmedse/jquery-toast-plugin
***/

// Define colors

const bgSuccess = "#7DCE94";
const bgError = "#BD8C7D";
const bgWarn = "#D1BFA7";
const fgSucces = "#3D3D3F";
const fgError = "#F6F5F3";
const fgWarn = "#49494B";

let bg = "";
let fg = "";

function toaster(type, body, header = "") {
  if (header === "") {
    switch (type) {
      case "success":
        header = "Success";
        break;
      case "warn":
        header = "Warning";
        break;
      case "err":
        header = "Error";
        break;
      default:
        header = "Message";
        break;
    }
  }

  switch (type) {
    case "success":
      bg = bgSuccess;
      fg = fgSucces;
      break;
    case "warn":
      bg = bgWarn;
      fg = fgWarn;
      break;
    case "err":
      bg = bgError;
      fg = fgError;
      break;
    default:
      bg = bgSuccess;
      fg = fgSucces;
      break;
  }
  $.toast({
    heading: header,
    text: body,
    showHideTransition: "slide",
    bgColor: bg,
    textColor: fg,
    allowToastClose: true,
    hideAfter: 5000,
    stack: false,
    textAlign: "center",
    position: "top-center",
  });
}
