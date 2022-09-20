const handleClickWordCard = function (value, favorite, complete) {
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
          <div class="value">${value}</div>
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
const handleClickFav = function () {
  console.log("click favorite");
  $("#fav").toggleClass("checked");
};
const handleClickComplete = function () {
  console.log("click complete");
  $("#complete").toggleClass("checked");
};

const cycleFromArr = (arr) => (number) => {
  const { length: len } = arr;
  return ((number % len) + len) % len;
};
let dragDist = 0;
let isMovable = true;
let isMoving = false;
let clickTime = 0;
const values = $("#words").data("values").split("-");
const cycle = cycleFromArr(values);
let showIndex = 0;
const datasToShow = (showIndex) => [-1, 0, 1].map((e) => values[cycle(e + showIndex)]);
const insertValuesOnCards = function () {
  $(".cards").each(function (index, card) {
    $(card).text(datasToShow(showIndex)[index]);
  });
};
$("#showing-card").on("touchstart mousedown", function () {
  clickTime = new Date().getTime();
});
$("#showing-card").on("touchend mouseup", function () {
  const clickTimeEnd = new Date().getTime();
  if (clickTimeEnd - clickTime < 100 && !isMoving) {
    handleClickWordCard($("#showing-card").text(), true, false);
  }
});
insertValuesOnCards();
const dragStart = function (e) {
  e.preventDefault();
  if (e.type == "touchstart") {
    $(document).off("mousedown", dragStart);
    startPoint = e.originalEvent.touches[0].pageX;
  } else {
    startPoint = e.pageX;
  }
  $("#words").on("touchmove mousemove", dragMove);
};

function dragMove(e) {
  if (e.type == "touchmove") {
    movePoint = e.originalEvent.touches[0].pageX;
  } else {
    movePoint = e.pageX;
  }
  isMoving = true;
  if (isMovable) {
    dragDist = ((movePoint - startPoint) / $("#favorite").width()) * 100;
    if (dragDist < 0) {
      $("#words").css("left", dragDist - 100 + "%");
      if (dragDist < -20) {
        isMovable = false;
        $("#words").css("transition", "all 0.3s");
        $("#words").css("left", "-200%");
        setTimeout(function () {
          $("#words").css("transition", "none");
          $("#words").css("left", "-100%");
          showIndex = cycle(showIndex + 1);
          insertValuesOnCards();
        }, 300);
      }
    }
    if (dragDist > 0) {
      $("#words").css("left", dragDist - 100 + "%");
      if (dragDist > 20) {
        isMovable = false;
        $("#words").css("transition", "all 0.3s");
        $("#words").css("left", "0");
        setTimeout(function () {
          $("#words").css("transition", "none");
          $("#words").css("left", "-100%");
          showIndex = cycle(showIndex - 1);
          insertValuesOnCards();
        }, 300);
      }
    }
  }
}
const dragEnd = function (e) {
  e.preventDefault();
  $("#words").off("touchmove mousemove", dragMove);
  if (Math.abs(dragDist) < 20) {
    $("#words").css("transition", "all 0.3s");
    $("#words").css("left", "-100%");
    setTimeout(function () {
      $("#words").css("transition", "none");
    }, 300);
  } else {
    isMovable = true;
    isMoving = false;
  }
  dragDist = 0;
};

$("#words").on("touchstart mousedown", dragStart);
$("#words").on("touchend mouseup", dragEnd);
