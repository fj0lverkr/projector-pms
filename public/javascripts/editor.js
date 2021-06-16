window.onload = () => {
  const storeData = window.localStorage;
  const draftTitle = storeData.getItem("draftTitle");
  const draft = storeData.getItem("draft");
  let editor = init(draft);
  if (draft && draftTitle) {
    $("#workingTitle").html(draftTitle);
    $("#previewTitle").html(draftTitle);
    $("#btnStartOver").removeClass("disabled");
    $("#btnStartOver").addClass("active");
    $("#btnSave").removeClass("disabled");
    $("#btnSave").addClass("active");
    $("#editorPreviewInner").html(convertToHtml(JSON.parse(draft).blocks));
    console.log(draft);
  } else {
    storeData.setItem("draftTitle", $("#workingTitle").html());
    console.log("no draft found in local storage.");
  }

  $("#btnStartOver").click(function () {
    let oTitle = $(this).val();
    $("#workingTitle").html(oTitle);
    $("#previewTitle").html(oTitle);
    $("#editorPreviewInner").html("");
    storeData.removeItem("draft");
    storeData.setItem("draftTitle", oTitle);
    $("#btnStartOver").removeClass("active");
    $("#btnStartOver").addClass("disabled");
    $("#btnSave").removeClass("active");
    $("#btnSave").addClass("disabled");
    editor.destroy();
    editor = init(draft);
  });

  function init(data) {
    let editor = new EditorJS({
      autofocus: true,
      tools: {
        underline: {
          class: Underline,
          shortcut: "CTRL+U",
        },
        header: {
          class: Header,
          inlineToolbar: true,
        },
        code: {
          class: CodeTool,
          shortcut: "CTRL+ALT+C",
        },
        inlineCode: {
          class: InlineCode,
          inlineToolbar: true,
          shortcut: "ALT+SHIFT+C",
        },
        list: {
          class: NestedList,
          shortcut: "CTRL+ALT+L",
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          shortcut: "CTRL+ALT+W",
          config: {
            titlePlaceholder: "Title",
            messagePlaceholder: "Message",
          },
        },
      },
      onChange: () => {
        editor
          .save()
          .then((outputData) => {
            storeData.setItem("draft", JSON.stringify(outputData));
            $("#timeStamp").html(
              "draft saved: " + convertTimeStamp(outputData.time)
            );
            console.log(storeData.getItem("draft"));
            $("#editorPreviewInner").html(convertToHtml(outputData.blocks));
            $("#btnStartOver").removeClass("disabled");
            $("#btnStartOver").addClass("active");
            $("#btnSave").removeClass("disabled");
            $("#btnSave").addClass("active");
          })
          .catch((error) => {
            console.log("Saving failed: ", error);
          });
      },
      data: JSON.parse(data),
    });
    return editor;
  }

  function convertTimeStamp(data) {
    return new Date(data).toString();
  }

  function convertToHtml(blocks) {
    let result = "";
    let openTag = "";
    let middleTag = "";
    let closeTag = "";
    let randomInt = 0;
    $.each(blocks, function () {
      switch (this.type) {
        case "paragraph":
          openTag = "<p>";
          closeTag = "</p>";
          result += openTag + this.data.text + closeTag;
          break;
        case "header":
          openTag = "<h" + this.data.level + ">";
          closeTag = "</h" + this.data.level + ">";
          result += openTag + this.data.text + closeTag;
          break;
        case "code":
          openTag = "<div class='inline-code' style='width: 100%;'><code>";
          closeTag = "</code></div>";
          result +=
            openTag +
            this.data.code
              .replace(/\n/g, "<br />")
              .replace(/  /g, "&ensp;&ensp;") +
            closeTag;
          break;
        case "list":
          if (this.data.style == "ordered") {
            openTag = "<ol class='nestedOl'>";
            closeTag = "</ol>";
          } else {
            openTag = "<ul>";
            closeTag = "</ul>";
          }
          result += renderList(this.data.items, openTag, closeTag);
          break;
        case "quote":
          openTag =
            "<figure class='text-center'><blockquote class='blockquote'><p>";
          middleTag =
            "</p></blockquote><figcaption class='blockquote-footer ms-2'>";
          closeTag = "</figcaption></figure>";
          result +=
            openTag + this.data.text + middleTag + this.data.caption + closeTag;
          break;
        case "checklist":
          randomInt = Math.floor(Math.random() * 1000);
          $.each(this.data.items, function (index) {
            var itemId = "list-" + randomInt + "-task-" + index + 1;
            var checked = this.checked ? "checked='checked'" : "";
            openTag =
              "<div class='custom-control custom-checkbox'><input type='checkbox' " +
              checked +
              " onclick='return false' class='custom-control-input align-middle' id='" +
              itemId +
              "'>";
            middleTag =
              "<label class='custom-control-label ms-1' for='" + itemId + "'>";
            closeTag = "</label></div>";
            result += openTag + middleTag + this.text + closeTag;
          });
          break;
        case "warning":
          openTag =
            "<div class='bg-warning my-3 mx-3 py-3 px-3 rounded'><h4><span class='text-danger me-2'><i class='fas fa-exclamation'></i></span><span class='text-uppercase'>";
          middleTag =
            "<span></h4><span class='ps-3' style='font-style: oblique;'>";
          closeTag = "</span></div>";
          result +=
            openTag +
            this.data.title +
            middleTag +
            this.data.message +
            closeTag;
          break;
      }
    });
    return result;
  }

  function renderList(data, open, close) {
    let list = open;
    $.each(data, function () {
      list += "<li>" + this.content;
      if (this.items.length > 0) {
        list += renderList(this.items, open, close);
      }
      list += "</li>";
    });
    list += close;
    return list;
  }
};
