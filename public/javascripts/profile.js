$(document).ready(function () {
  $(".ld").each(function () {
    $(this).hide();
  });
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
    $("#inputAlias").prop("disabled", true);
    $("#saveEditAlias").hide();
    $("#aliasSpinner").show();
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
          $("#aliasSpinner").hide();
          $("#saveEditAlias").hide();
          $("#input-groupAlias").hide();
          $("#profileAlias").show();
          $("#toggleEditAlias").show();
          $("#inputAlias").prop("disabled", false);
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
    $("#inputFirstName").prop("disabled", true);
    $("#saveEditFirstName").hide();
    $("#firstNameSpinner").show();
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
          $("#firstNameSpinner").hide();
          $("#input-groupFirstName").hide();
          $("#profileFirstName").show();
          $("#toggleEditFirstName").show();
          $("#inputFirstName").prop("disabled", false);
        } else {
          toaster("error", data.reason);
        }
      }
    );
  });

  // Set last name field editable
  $("#toggleEditLastName").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#inputLastName").val($("#profileLastName").text());
    $("#profileLastName").hide();
    $("#saveEditLastName").show();
    $("#input-groupLastName").show();
  });

  // Save last name field
  $("#saveEditLastName").click(function (e) {
    let newLastName = $("#inputLastName").val();
    e.preventDefault();
    $("#inputLastName").prop("disabled", true);
    $("#saveEditLastName").hide();
    $("#lastNameSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateLastName",
        oldLastName: $("#profileLastName").text(),
        newLastName: newLastName,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileLastName").text(newLastName);
          }
          $("span#navbarLastName").text(newLastName);
          $("#titleLastName").text(newLastName);
          $("#lastNameSpinner").hide();
          $("#saveEditLastName").hide();
          $("#input-groupLastName").hide();
          $("#profileLastName").show();
          $("#toggleEditLastName").show();
          $("#inputLastName").prop("disabled", false);
        } else {
          toaster("error", data.reason);
        }
      }
    );
  });
});
