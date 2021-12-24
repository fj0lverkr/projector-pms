const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if(!req.userContext){
    return res.status(401).render("unauthenticated");
  }
  /*
    Get a list of all active Teams, we'll show this list together with a search function, a function to join a Team (if said team is open to new applicants) and an option to create your own teams.
    Show the Teams n° of members, n° of active/completed projects and n° of ideas, as long as they are public and/or the Teams privacy settings allow it.
    Highlight the Teams the user is already a member of with some icon
    In the Teams card we show the teams description text, again only when the Team's privacy settings allow this.
  */
  return res.render("teams-all");
});

router.get("/my", (req, res) => {
  if(!req.userContext){
    return res.status(401).render("unauthenticated");
  }
  /*
    Get a list of the teams the user is a member of.
    showing more info on the cards and having a pan on the right that previews the selected Team (e.g. show some sort of activity feed for that Team).
    Allow the user to click through to a page fully dedicated to the Team.
  */
  return res.render("teams-my");
});

router.get("/team/:teamId", (req, res) => {
  if(!req.userContext){
    return res.status(401).render("unauthenticated");
  }
  /*
    Check Teammembership:
    - not a member --> 401
    - regular member
    - admin/teamlead --> manage Team options
  Show a list of ideas available for the Team (teamlead only)
  Show current and past projects
  Show list of members
  ...
  */
  return res.render("team");
});

module.exports = router;
