const express = require("express");
const router = express.Router();

router.get("/callback", (req, res) => {
    res.redirect("/dashboard");
  });

module.exports = router;