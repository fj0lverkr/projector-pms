import { getFileType, resizeImage, validateEmail, getValidUrl } from "./util.js";

$(document).ready(function () {
  let selectedProfilePicture = null;
  $(".ld").each(function () {
    $(this).hide();
  });
  let phoneInput = null;
  if ($("#inputMobile").length) {
    const phoneInputField = document.querySelector("#inputMobile");
    phoneInput = window.intlTelInput(phoneInputField, {
      preferredCountries: [],
      initialCountry: cc,
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
  }

  // Set up choises.js elements

  // 1. for the city selector:
  let choicesOptCities = [];
  optCities.forEach(e => {
    choicesOptCities.push(JSON.parse('{"value": "' + e.id + '", "label": "' + e.city_name + '"}'));
  });
  const locationElem = document.querySelector("#js-choises-location");
  const locationChoises = new Choices(locationElem, {
    choices: choicesOptCities,
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
    if (validateEmail($(this).val())) {
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
    if (validateEmail($(this).val()) || $(this).val() === "") {
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

  // Save mobile phone field
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
  $("#fileProfilePicture").change(function () {
    let file = this.files[0];
    getFileType(file, function (mime) {
      if (
        mime.expected === mime.mime &&
        mime.mime.substring(0, 6) === "image/"
      ) {
        $("#labelProfilePicture").hide();
        $("#saveProfilePicture").removeClass("disabled");
        $("#saveProfilePicture").attr("aria-disabled", "false");
        selectedProfilePicture = file;
      } else {
        $("#saveProfilePicture").addClass("disabled");
        $("#saveProfilePicture").attr("aria-disabled", "true");
        $("#labelProfilePicture").text("Picture is invalid");
        $("#labelProfilePicture").show();
        selectedProfilePicture = null;
      }
    });
  });
  $("#saveProfilePicture").click(function (e) {
    e.preventDefault();
    resizeImage(selectedProfilePicture, 150, function (result) {
      if (result.success) {
        $.post(
          "../../users/ajax",
          {
            action: "updateProfilePicture",
            oldDataUrl: $("#imgProfilePicture").attr("src"),
            newDataUrl: result.dataUrl,
          },
          function (data) {
            if (data.success === true || data.reason === "") {
              if (data.success === true) {
                $("#modalProfilePicture").modal("toggle");
                toaster("success", data.reason);

                $("#imgProfilePicture").attr("src", result.dataUrl);
              }
            } else {
              toaster("error", data.reason);
              $("#modalProfilePicture").modal("toggle");
            }
          }
        );
      } else {
        $("#saveProfilePicture").addClass("disabled");
        $("#saveProfilePicture").attr("aria-disabled", "true");
        $("#labelProfilePicture").text(result.reason);
        $("#labelProfilePicture").show();
        selectedProfilePicture = null;
      }
    });
  });

  // Set title field editable
  $("#toggleEditTitle").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileTitle").hide();
    $("#saveEditTitle").show();
    $("#input-groupTitle").show();
      $("#inputTitle").val($("#profileTitle").text());
  });

  // Save title field
  $("#saveEditTitle").click(function (e) {
    let newTitle = $("#inputTitle").val();
    e.preventDefault();
    $("#inputTitle").prop("disabled", true);
    $("#saveEditTitle").hide();
    $("#titleSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateTitle",
        oldTitle: $("#profileTitle").text(),
        newTitle: newTitle,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileTitle").text(newTitle);
          }
          $("#titleSpinner").hide();
          $("#saveEditTitle").hide();
          $("#input-groupTitle").hide();
          $("#profileTitle").show();
          $("#toggleEditTitle").show();
          $("#inputTitle").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputTitle").prop("disabled", false);
          $("#titleSpinner").hide();
          $("#saveEditTitle").show();
        }
      }
    );
  });

  // Save location
  $("#saveProfileLocation").click(function (e) {
    let newLocation = locationChoises.getValue();
    e.preventDefault();
    $.post(
      "../../users/ajax",
      {
        action: "updateProfileLocation",
        newCountry: cc,
        newCity: newLocation.value,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileLocation").text(newLocation.label + " area, " + ccName);
            $("#modalProfileLocation").modal("toggle");
          }
        } else {
          toaster("error", data.reason);
        }
      }
    );
  });

  // Set website field editable
  $("#toggleEditWebsite").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileWebsiteUrl").hide();
    $("#noWebsitePlaceholder").hide();
    $("#saveEditWebsite").show();
    $("#input-groupWebsite").show();
    $("#inputWebsite").val($("#profileWebsiteUrl").text());
  });

  // Save website field
  $("#saveEditWebsite").click(function (e) {
    let newWebsite = $("#inputWebsite").val();
    if(newWebsite != ""){
      newWebsite = getValidUrl(newWebsite);
    }
    e.preventDefault();
    $("#inputWebsite").prop("disabled", true);
    $("#saveEditWebsite").hide();
    $("#websiteSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateWebsite",
        oldVal: $("#profileWebsiteUrl").prop("href"),
        newVal: newWebsite,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileWebsiteUrl").text(newWebsite);
            $("#profileWebsiteUrl").prop("href",newWebsite);
          }
          $("#websiteSpinner").hide();
          $("#saveEditWebsite").hide();
          $("#input-groupWebsite").hide();
          if(newWebsite != ""){
            $("#profileWebsiteUrl").show();
          } else {
            $("#noWebsitePlaceholder").show();
          }
          $("#toggleEditWebsite").show();
          $("#inputWebsite").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputWebsite").prop("disabled", false);
          $("#websiteSpinner").hide();
          $("#saveEditWebsite").show();
        }
      }
    );
  });

  // Set Github field editable
  $("#toggleEditGithub").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileGithubUrl").hide();
    $("#noGithubPlaceholder").hide();
    $("#saveEditGithub").show();
    $("#input-groupGithub").show();
    let oldGithub = $("#profileGithubUrl").text();
    $("#inputGithub").val(oldGithub);
  });

  // Save Github field
  $("#saveEditGithub").click(function (e) {
    let newGithub = $("#inputGithub").val();
    e.preventDefault();
    $("#inputGithub").prop("disabled", true);
    $("#saveEditGithub").hide();
    $("#githubSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateGithub",
        oldVal: $("#profileGithubUrl").text(),
        newVal: newGithub,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileGithubUrl").text(newGithub);
            $("#profileGithubUrl").prop("href","https://github.com/" + newGithub);
          }
          $("#githubSpinner").hide();
          $("#saveEditGithub").hide();
          $("#input-groupGithub").hide();
          if(newGithub != ""){
            $("#profileGithubUrl").show();
          } else {
            $("#noGithubPlaceholder").show();
          }
          $("#toggleEditGithub").show();
          $("#inputGithub").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputGithub").prop("disabled", false);
          $("#githubSpinner").hide();
          $("#saveEditGithub").show();
        }
      }
    );
  });

  // Set LinkedIn field editable
  $("#toggleEditLinkedIn").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileLinkedInUrl").hide();
    $("#noLinkedInPlaceholder").hide();
    $("#saveEditLinkedIn").show();
    $("#input-groupLinkedIn").show();
    let oldLinkedIn = $("#profileLinkedInUrl").text();
    $("#inputLinkedIn").val(oldLinkedIn);
  });

  // Save LinkedIn field
  $("#saveEditLinkedIn").click(function (e) {
    let newLinkedIn = $("#inputLinkedIn").val();
    e.preventDefault();
    $("#inputLinkedIn").prop("disabled", true);
    $("#saveEditLinkedIn").hide();
    $("#linkedInSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateLinkedIn",
        oldVal: $("#profileLinkedInUrl").text(),
        newVal: newLinkedIn,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileLinkedInUrl").text(newLinkedIn);
            $("#profileLinkedInUrl").prop("href","https://www.linkedin.com/" + newLinkedIn);
          }
          $("#linkedInSpinner").hide();
          $("#saveEditLinkedIn").hide();
          $("#input-groupLinkedIn").hide();
          if(newLinkedIn != ""){
            $("#profileLinkedInUrl").show();
          } else {
            $("#noLinkedInPlaceholder").show();
          }
          $("#toggleEditLinkedIn").show();
          $("#inputLinkedIn").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputLinkedIn").prop("disabled", false);
          $("#linkedInSpinner").hide();
          $("#saveEditLinkedIn").show();
        }
      }
    );
  });

  // Set Twitter field editable
  $("#toggleEditTwitter").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileTwitterUrl").hide();
    $("#noTwitterPlaceholder").hide();
    $("#saveEditTwitter").show();
    $("#input-groupTwitter").show();
    let oldTwitter = $("#profileTwitterUrl").text();
    $("#inputTwitter").val(oldTwitter);
  });

  // Save Twitter field
  $("#saveEditTwitter").click(function (e) {
    let newTwitter = $("#inputTwitter").val();
    e.preventDefault();
    $("#inputTwitter").prop("disabled", true);
    $("#saveEditTwitter").hide();
    $("#twitterSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateTwitter",
        oldVal: $("#profileTwitterUrl").text(),
        newVal: newTwitter,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            let newTwitterText ="";
            if(newTwitter != ""){
              if(newTwitter.charAt(0) == "@"){
                newTwitterText = newTwitter;
                newTwitter = newTwitter.substr(1);
              } else {
              newTwitterText = "@" + newTwitter;
              }
            }
            $("#profileTwitterUrl").text(newTwitterText);
            $("#profileTwitterUrl").prop("href","https://www.twitter.com/" + newTwitter);
          }
          $("#twitterSpinner").hide();
          $("#saveEditTwitter").hide();
          $("#input-groupTwitter").hide();
          if(newTwitter != ""){
            $("#profileTwitterUrl").show();
          } else {
            $("#noTwitterPlaceholder").show();
          }
          $("#toggleEditTwitter").show();
          $("#inputTwitter").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputTwitter").prop("disabled", false);
          $("#twitterSpinner").hide();
          $("#saveEditTwitter").show();
        }
      }
    );
  });

  // Set Instagram field editable
  $("#toggleEditInstagram").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileInstagramUrl").hide();
    $("#noInstagramPlaceholder").hide();
    $("#saveEditInstagram").show();
    $("#input-groupInstagram").show();
    let oldInstagram = $("#profileInstagramUrl").text();
    $("#inputInstagram").val(oldInstagram);
  });

  // Save Instagram field
  $("#saveEditInstagram").click(function (e) {
    let newInstagram = $("#inputInstagram").val();
    e.preventDefault();
    $("#inputInstagram").prop("disabled", true);
    $("#saveEditInstagram").hide();
    $("#instagramSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateInstagram",
        oldVal: $("#profileInstagramUrl").text(),
        newVal: newInstagram,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            let newInstagramText="";
            if(newInstagram != ""){
              if(newInstagram.charAt(0) == "@"){
                newInstagramText = newInstagram;
                newInstagram = newInstagram.substr(1);
              }else{
                newInstagramText = "@" + newInstagram;
              }
            }
            $("#profileInstagramUrl").text(newInstagramText);
            $("#profileInstagramUrl").prop("href","https://www.instagram.com/" + newInstagram);
          }
          $("#instagramSpinner").hide();
          $("#saveEditInstagram").hide();
          $("#input-groupInstagram").hide();
          if(newInstagram != ""){
            $("#profileInstagramUrl").show();
          } else {
            $("#noInstagramPlaceholder").show();
          }
          $("#toggleEditInstagram").show();
          $("#inputInstagram").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputInstagram").prop("disabled", false);
          $("#instagramSpinner").hide();
          $("#saveEditInstagram").show();
        }
      }
    );
  });

  // Set Facebook field editable
  $("#toggleEditFacebook").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $("#profileFacebookUrl").hide();
    $("#noFacebookPlaceholder").hide();
    $("#saveEditFacebook").show();
    $("#input-groupFacebook").show();
    let oldFacebook = $("#profileFacebookUrl").text();
    $("#inputFacebook").val(oldFacebook);
  });

  // Save Facebook field
  $("#saveEditFacebook").click(function (e) {
    let newFacebook = $("#inputFacebook").val();
    e.preventDefault();
    $("#inputFacebook").prop("disabled", true);
    $("#saveEditFacebook").hide();
    $("#facebookSpinner").show();
    $.post(
      "../../users/ajax",
      {
        action: "updateFacebook",
        oldVal: $("#profileFacebookUrl").text(),
        newVal: newFacebook,
      },
      function (data) {
        if (data.success === true || data.reason === "") {
          if (data.success === true) {
            toaster("success", data.reason);
            $("#profileFacebookUrl").text(newFacebook);
            $("#profileFacebookUrl").prop("href","https://www.facebook.com/" + newFacebook);
          }
          $("#facebookSpinner").hide();
          $("#saveEditFacebook").hide();
          $("#input-groupFacebook").hide();
          if(newFacebook != ""){
            $("#profileFacebookUrl").show();
          } else {
            $("#noFacebookPlaceholder").show();
          }
          $("#toggleEditFacebook").show();
          $("#inputFacebook").prop("disabled", false);
        } else {
          toaster("error", data.reason);
          $("#inputFacebook").prop("disabled", false);
          $("#facebookSpinner").hide();
          $("#saveEditFacebook").show();
        }
      }
    );
  });

});
