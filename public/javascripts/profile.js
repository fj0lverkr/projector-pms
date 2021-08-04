const ValidateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

$(document).ready(function () {
  $(".ld").each(function () {
    $(this).hide();
  });
    let phoneInput =  null;
  if ($("#inputMobile").length) {
    const phoneInputField = document.querySelector("#inputMobile");
    phoneInput = window.intlTelInput(phoneInputField, {
      preferredCountries: [],
      initialCountry: cc,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
  }

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
          $("#inputAlias").prop("disabled", false);
          $("#aliasSpinner").hide();
          $("#saveEditAlias").show();
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
          $("#inputFirstName").prop("disabled", false);
          $("#firstNameSpinner").hide();
          $("#saveEditFirstName").show();
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
          $("#inputLastName").prop("disabled", false);
          $("#lastNameSpinner").hide();
          $("#saveEditLastName").show();
        }
      }
    );
  });

  // Set e-mail field editable
  $("#toggleEditEmail").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#inputEmail").val($("#profileEmail").text());
    $("#profileEmail").hide();
    $("#saveEditEmail").show();
    $("#input-groupEmail").show();
  });

  // Validate input
  $("#inputEmail").keyup(function () {
    if (ValidateEmail($(this).val())) {
      $("#saveEditEmail").show();
    } else {
      $("#saveEditEmail").hide();
    }
  });

  // Save e-mail field
  $("#saveEditEmail").click(function (e) {
    let newEmail = $("#inputEmail").val();
    e.preventDefault();
    $("#inputEmail").prop("disabled", true);
    $("#saveEditEmail").hide();
    $("#emailSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateEmail",
        oldEmail: $("#profileEmail").text(),
        newEmail: newEmail,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileEmail").text(newEmail);
          }
          $("#emailSpinner").hide();
          $("#saveEditEmail").hide();
          $("#input-groupEmail").hide();
          $("#profileEmail").show();
          $("#toggleEditEmail").show();
          $("#inputEmail").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputEmail").prop("disabled", false);
          $("#emailSpinner").hide();
          $("#saveEditEmail").show();
        }
      }
    );
  });

  // Set secondary e-mail field editable
  $("#toggleEditEmail2").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#inputEmail2").val($("#profileEmail2").text());
    $("#profileEmail2").hide();
    $("#saveEditEmail2").show();
    $("#input-groupEmail2").show();
  });

  // Validate input
  $("#inputEmail2").keyup(function () {
    if (ValidateEmail($(this).val()) || $(this).val() === "") {
      $("#saveEditEmail2").show();
    } else {
      $("#saveEditEmail2").hide();
    }
  });

  // Save secondary e-mail field
  $("#saveEditEmail2").click(function (e) {
    let newEmail = $("#inputEmail2").val();
    e.preventDefault();
    $("#inputEmail2").prop("disabled", true);
    $("#saveEditEmail2").hide();
    $("#email2Spinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateSecondaryEmail",
        oldEmail: $("#profileEmail2").text(),
        newEmail: newEmail,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileEmail2").text(newEmail);
          }
          $("#email2Spinner").hide();
          $("#saveEditEmail2").hide();
          $("#input-groupEmail2").hide();
          $("#profileEmail2").show();
          $("#toggleEditEmail2").show();
          $("#inputEmail2").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputEmail2").prop("disabled", false);
          $("#email2Spinner").hide();
          $("#saveEditEmail2").show();
        }
      }
    );
  });

  // Set mobile field editable
  $("#toggleEditMobile").click(function (e) {
    e.preventDefault();
    $(this).hide();
    let profileField = document.getElementById("#profileMobile");
    let fieldGroup = document.getElementById("#input-groupMobile");
    phoneInput.setNumber(profileField.innerText);
    profileField.style.display = "none";
    $("#saveEditMobile").show();
    fieldGroup.style.display = "block";
  });

  // Validate input
  $("#inputMobile").keyup(function () {
    if (phoneInput.isValidNumber() || $("#inputMobile").val() === "") {
      $("#saveEditMobile").show();
    } else {
      $("#saveEditMobile").hide();
    }
  });

  // Save secondary e-mail field
  $("#saveEditMobile").click(function (e) {
    let newMobile = phoneInput.getNumber();
    let profileField = document.getElementById("#profileMobile");
    let fieldGroup = document.getElementById("#input-groupMobile");
    e.preventDefault();
    $("#inputMobile").prop("disabled", true);
    $("#saveEditMobile").hide();
    $("#mobileSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateMobile",
        oldMobile: $("#profileMobile").text(),
        newMobile: newMobile,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            profileField.innerText = newMobile;
          }
          $("#mobileSpinner").hide();
          $("#saveEditMobile").hide();
          fieldGroup.style.display = "none";
          profileField.style.display = "block";
          $("#toggleEditMobile").show();
          $("#inputMobile").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputMobile").prop("disabled", false);
          $("#mobileSpinner").hide();
          $("#saveEditMobile").show();
        }
      }
    );
  });
});
