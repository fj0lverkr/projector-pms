$(document).ready(function () {
  $(".roleSelect").change(function () {
    let selectedRole = $(this).val();
    let selectedUser = $(this).attr("id");
    selectedUser = selectedUser.split("=", 2)[1];
    $.post(
      "../admin/users-ajax",
      { action: "updateRole", userId: selectedUser, roleId: selectedRole },
      function (data) {
        //add a visual element to show the action succeeded or failed
        console.log(data);
        if (data === "OK") {
          toaster("success", "Role was modified.");
        }
      }
    );
  });
});
