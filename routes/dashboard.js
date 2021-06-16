const express = require("express");
const router = express.Router();
const WorkingTitle = require("../util/working-title");

//Dashboard page
router.get("/", (req, res) => {
  //TODO remove testing code here and document views/includes/editor.pug accordingly
  let newWorkingTitle = new WorkingTitle(3).title;
  res.render("dashboard", {
    workingTitle: newWorkingTitle,
    recordType: "testform",
  });
});

module.exports = router;
