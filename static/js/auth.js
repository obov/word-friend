const handleClickLoginLabel = function () {
  console.log("login");
  $("#loginIndi").addClass("checked");
  $("#signupIndi").removeClass("checked");
};
const handleClickSignupLabel = function () {
  console.log("signup");
  $("#signupIndi").addClass("checked");
  $("#loginIndi").removeClass("checked");
};
