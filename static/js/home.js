const showWordChecker = function (value, favorite, complete) {
  const fav = typeof favorite === "boolean" ? favorite : pyBoolToJs(favorite);
  const comp = typeof complete === "boolean" ? complete : pyBoolToJs(complete);
  $("#modalPlace").append(`
    <div id="wordViewer" class="word-viewer">
      <div class="header-wrapper">
        <div class="header">
          <div class="back" id="back">
            <i class="bi bi-chevron-left">
            </i>
          </div>
        </div>
      </div>
      <div class="content">
          <div class="value"><span>${value}</span></div>
          <div class="btns-wrapper">
            <div id="fav" class="fav ${
              fav ? "checked" : ""
            }" onclick="handleClickFav()"><i class="bi bi-heart-fill"></i></div>
            <div id="complete" class="complete ${
              comp ? "checked" : ""
            }" onclick="handleClickComplete()"><i class="bi bi-check-lg"></i></div>
          </div>
      </div>
    </div>
  `);
  $("#back").on("click", function () {
    $("#wordViewer").removeClass("slide-up");
    setTimeout(function () {
      $("#modalPlace").empty();
    }, 500);
  });
  setTimeout(function () {
    $("#wordViewer").addClass("slide-up");
  }, 1);
};

const handleClickWordCard = function (value, favorite, complete) {
  showWordChecker(value, favorite, complete);
};

const handleClickFav = function () {
  console.log("click favorite");
  $("#fav").toggleClass("checked");
};
const handleClickComplete = function () {
  console.log("click complete");
  $("#complete").toggleClass("checked");
};
