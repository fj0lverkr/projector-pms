/***
this requires jquery.toast to be loaded first:
https://github.com/kamranahmedse/jquery-toast-plugin
***/

// Define colors

const bgSuccess = "#7DCE94";
const bgError = "#BD8C7D";
const bgWarn = "#D1BFA7";
const bgNotice = "#8E8E90";
const fgSucces = "#3D3D3F";
const fgError = "#F6F5F3";
const fgWarn = "#49494B";
const fgNotice = "#F9F8FD";

// Set some defaults
let bg = bgNotice;
let fg = fgNotice;
let bgloader = fgNotice;

// Show toast with default settings for Projector PMS
function toaster(type, body, header = "") {
  if (header === "") {
    switch (type) {
      case "success":
        header = "Success";
        break;
      case "warning":
        header = "Warning";
        break;
      case "error":
        header = "Error";
        break;
      case "info":
        header = "Notice";
        break;
      default:
        header = "Notice";
        break;
    }
  }

  switch (type) {
    case "success":
      bg = bgSuccess;
      fg = fgSucces;
      bgloader = fgSucces;
      break;
    case "warning":
      bg = bgWarn;
      fg = fgWarn;
      bgloader = fgWarn;
      break;
    case "error":
      bg = bgError;
      fg = fgError;
      bgloader = fgError;
      break;
    case "info":
      bg = bgNotice;
      fg = fgNotice;
      bgloader = fgNotice;
      break;
    default:
      bg = bgNotice;
      fg = fgNotice;
      bgloader = fgNotice;
      break;
  }

  $.toast({
    heading: header,
    text: body,
    icon: type,
    showHideTransition: "slide",
    bgColor: bg,
    textColor: fg,
    allowToastClose: true,
    hideAfter: 5000,
    stack: true,
    textAlign: "center",
    position: "top-center",
    loaderBg: bgloader,
  });
}
