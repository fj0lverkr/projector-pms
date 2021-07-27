$(document).ready(function () {
  $("#resetPassword").click(function (e) {
    e.preventDefault();
    selectedUser = $(this).attr("user");
    $.post(
      "../../admin/users-ajax",
      { action: "resetPassword", userId: selectedUser },
      function (data) {
        //add a visual element to show the action succeeded or failed
        console.log(data);
        if (data === "OK") {
          toaster("success", "Recovery Email sent.");
        } else {
          console.log(data);
          toaster("error", "Something went wrong.");
        }
      }
    );
  });
});
