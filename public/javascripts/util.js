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

const getFileType = (file, callback) => {
  if (window.FileReader && window.Blob) {
    let reader = new FileReader();
    let blob = file.slice(0, 4);
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

const validateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

// EXPORTS
export { getFileType, validateEmail };
