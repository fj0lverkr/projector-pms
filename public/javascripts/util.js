// TODO add more mimetypes: https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern

const mimes = [
  {
    mime: "image/jpeg",
    pattern: [0xff, 0xd8, 0xff],
    mask: [0xff, 0xff, 0xff],
  },
  {
    mime: "image/png",
    pattern: [0x89, 0x50, 0x4e, 0x47],
    mask: [0xff, 0xff, 0xff, 0xff],
  },
  {
    mime: "image/webp",
    pattern: [
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
      0x56, 0x50,
    ],
    mask: [
      0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff,
    ],
  },
  {
    mime: "image/gif",
    pattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
  },
  {
    mime: "image/gif",
    pattern: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
  },
  {
    mime: "image/bmp",
    pattern: [0x42, 0x4d],
    mask: [0xff, 0xff],
  },
];

const check = (bytes, mime) => {
  for (var i = 0, l = mime.mask.length; i < l; ++i) {
    if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
      return false;
    }
  }
  return true;
};

// TODO add more types as neccesary
const getMinBytes = (fileType) => {
  switch (fileType.toLowerCase().split("/")[1]) {
    case "bmp":
      return 2;
    case "gif":
      return 6;
    case "webp":
      return 14;
    case "png":
      return 8;
    default:
      return 4;
  }
};

const getFileType = (file, callback) => {
  if (window.FileReader && window.Blob) {
    let reader = new FileReader();
    let blob = file.slice(0, getMinBytes(file.type));
    reader.onloadend = function (e) {
      if (e.target.readyState === FileReader.DONE) {
        let bytes = new Uint8Array(e.target.result);
        for (var i = 0, l = mimes.length; i < l; ++i) {
          if (check(bytes, mimes[i])) {
            return callback({ expected: file.type, mime: mimes[i].mime });
          }
        }
        return callback({ expected: file.type, mime: "file/other" });
      }
    };
    reader.readAsArrayBuffer(blob);
  } else {
    return callback({ expected: file.type, mime: "file/other" });
  }
};

/* Utility function to convert a canvas to a BLOB */
const dataURLToBlob = (dataURL) => {
  const BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    let parts = dataURL.split(",");
    let contentType = parts[0].split(":")[1];
    let raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  let parts = dataURL.split(BASE64_MARKER);
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
/* End Utility function to convert a canvas to a BLOB      */

const resizeImage = (file, maxSize, callback) => {
  getFileType(file, function (mime) {
    if (mime.expected === mime.mime && mime.mime.substring(0, 6) === "image/") {
      // Load the image
      let reader = new FileReader();
      reader.onload = function (readerEvent) {
        let image = new Image();
        image.onload = function (_) {
          let canvas = document.createElement("canvas"),
            width = image.naturalWidth,
            height = image.naturalHeight;
          canvas.width = maxSize;
          canvas.height = maxSize;
          if (width === height) {
            canvas.getContext("2d").drawImage(image, 0, 0, maxSize, maxSize);
          } else {
            //crop to square of maxSize * maxSize
            let limit = width > height ? height : width;
            canvas
              .getContext("2d")
              .drawImage(image, 0, 0, limit, limit, 0, 0, maxSize, maxSize);
          }
          let dataUrl = canvas.toDataURL("image/png");
          let resizedImage = dataURLToBlob(dataUrl);
          return callback({
            success: true,
            reason: "OK",
            blob: resizedImage,
            dataUrl: dataUrl,
          });
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      return callback({
        success: false,
        reason: "not a valid image file",
        blob: null,
        dataUrl: null,
      });
    }
  });
};

const validateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

// EXPORTS
export { getFileType, resizeImage, validateEmail };
