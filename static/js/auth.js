const handleClickLoginLabel = function () {
  $("#loginIndi").addClass("checked");
  $("#signupIndi").removeClass("checked");
};
const handleClickSignupLabel = function () {
  $("#signupIndi").addClass("checked");
  $("#loginIndi").removeClass("checked");
};
const handleSubmitSignUp = function (event) {
  event.preventDefault();
  go_signup();
};
const handleSubmitLogIn = function (event) {
  event.preventDefault();
  login();
};
const handleClickSignUpCancel = function () {
  alert("가입해주세요ㅠㅠ!");
};
const handleClickLogInCancel = function () {
  alert("log in Plz!!");
};
