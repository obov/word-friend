// Home animations
const wordSlider = function () {
  const handleClickShowing = function () {
    const clickTimeEnd = new Date().getTime();
    if (clickTimeEnd - clickTime < 100 && !isMoving) {
      showWordChecker($("#showing-card").text(), true, false);
    }
  };

  let dragDist = 0;
  let isMovable = true;
  let isMoving = false;
  let clickTime = 0;
  let showIndex = 0;

  const values = $("#words").data("values").split("-");
  const cycleFromArr = (arr) => (number) => {
    const { length: len } = arr;
    return ((number % len) + len) % len;
  };
  const cycle = cycleFromArr(values);
  const datasToShow = (showIndex) => [-1, 0, 1].map((e) => values[cycle(e + showIndex)]);
  const insertValuesOnCards = function () {
    $(".cards").each(function (index, card) {
      $(card).text(datasToShow(showIndex)[index]);
    });
  };

  $("#showing-card").on("touchstart mousedown", function () {
    clickTime = new Date().getTime();
  });
  $("#showing-card").on("touchend mouseup", handleClickShowing());

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
};
const whenHomeOpened = function () {
  wordSlider();
};
const hideHamburger = function () {
  $(".menu-toggle").hide();
};
// Auth animations
const whenAuthOpened = function () {
  hideHamburger();
};

if (location.pathname === PATHNAME.HOME) {
  whenHomeOpened();
}
if (location.pathname === PATHNAME.LOGIN) {
  whenAuthOpened();
}
