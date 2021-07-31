$(document).ready(function () {
  // Handle password recovery click event
  $("#resetPassword").click(function (e) {
    e.preventDefault();
    let selectedUser = $(this).attr("user");
    $.post(
      "../../admin/users-ajax",
      { action: "resetPassword", userId: selectedUser },
      function (data) {
        if (data === "OK") {
          toaster("success", "Recovery Email sent.");
        } else {
          console.log(data);
          toaster("error", "Something went wrong.");
        }
      }
    );
  });

  // Set alias field editable
  $("#toggleEditAlias").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#inputAlias").val($("#profileAlias").text());
    $("#profileAlias").hide();
    $("#saveEditAlias").show();
    $("#input-groupAlias").show();
  });

  // Save alias field
  $("#saveEditAlias").click(function (e) {
    e.preventDefault();
    $.post(
      "../../users/ajax",
      {
        action: "updateAlias",
        oldAlias: $("#profileAlias").text(),
        newAlias: $("#inputAlias").val(),
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileAlias").text($("#inputAlias").val());
          }
          $("#saveEditAlias").hide();
          $("#input-groupAlias").hide();
          $("#profileAlias").show();
          $("#toggleEditAlias").show();
        } else {
          toaster("error", data.reason);
        }
      }
    );
  });

  // Set first name field editable
  $("#toggleEditFirstName").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#inputFirstName").val($("#profileFirstName").text());
    $("#profileFirstName").hide();
    $("#saveEditFirstName").show();
    $("#input-groupFirstName").show();
  });

  // Save first name field
  $("#saveEditFirstName").click(function (e) {
    let newFirstName = $("#inputFirstName").val();
    e.preventDefault();
    $.post(
      "../../users/ajax",
      {
        action: "updateFirstName",
        oldFirstName: $("#profileFirstName").text(),
        newFirstName: newFirstName,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileFirstName").text(newFirstName);
          }
          $("span#navbarFirstName").text(newFirstName);
          $("#titleFirstName").text(newFirstName);
          $("#saveEditFirstName").hide();
          $("#input-groupFirstName").hide();
          $("#profileFirstName").show();
          $("#toggleEditFirstName").show();
        } else {
          toaster("error", data.reason);
        }
      }
    );
  });
});
