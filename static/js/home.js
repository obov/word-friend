const handleClickWordCard = function (value, favorite, complete) {
  console.log("word card");
  console.log("value : ", value);
  const fav = pyBoolToJs(favorite);
  const comp = pyBoolToJs(complete);
  console.log("fav : ", fav);
  console.log("comp : ", comp);
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
  }, 0);
};
const handleClickFav = function () {
  console.log("click favorite");
  $("#fav").toggleClass("checked");
};
const handleClickComplete = function () {
  console.log("click complete");
  $("#complete").toggleClass("checked");
};

const dragStart = function (e) {
  e.preventDefault();
  console.log(e);
  e.preventDefault();
  if (e.type == "touchstart") {
    $(document).off("mousedown", dragStart);
    startPoint = e.originalEvent.touches[0].pageX;
  } else {
    startPoint = e.pageX;
  }
  dragDist = 0;
  $("#wordList").on("touchmove mousemove", dragMove);
};
function dragMove(e) {
  if (e.type == "touchmove") {
    movePoint = e.originalEvent.touches[0].pageX;
  } else {
    movePoint = e.pageX;
  }
  dragDist = startPoint - movePoint;
  console.log(dragDist);
  // dragDist = ((movePoint - startPoint) / $(".slider").height()) * 100;

  // $(".slider").addClass("dragging");

  // $(".slide, .bg").css({
  //   transition: "0ms",
  // });

  // if (dragDist < 0) {
  //   $(".active .bg").css({
  //     opacity: 1 + dragDist / 200,
  //   });
  //   $(".active")
  //     .css({
  //       transform: "translate3d(0," + dragDist / 2 + "%,0)",
  //     })
  //     .next()
  //     .css({
  //       transform: "translate3d(0," + (100 + dragDist) + "%,0)",
  //     });
  // }

  // if (dragDist > 0) {
  //   $(".active")
  //     .css({
  //       transform: "translate3d(0," + dragDist + "%,0)",
  //     })
  //     .prev()
  //     .css({
  //       animation: "none",
  //       transform: "translate3d(0," + (-50 + dragDist / 2) + "%,0)",
  //     })
  //     .find(".bg")
  //     .css({
  //       opacity: 0.5 + dragDist / 200,
  //     });
  // }
}
const dragEnd = function (e) {
  e.preventDefault();
  console.log(e);
  $("#wordList").off("touchmove mousemove", dragMove);
};

$("#wordList").on("touchstart mousedown", dragStart);
$("#wordList").on("touchend mouseup", dragEnd);
