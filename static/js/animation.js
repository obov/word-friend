// Home animations
const wordSlider = function (part) {
  const words = () => $(`#${part} > .words`);
  const showingCard = () => $(`#${part}ShowingCard`);
  const cards = () => $(`#${part} > .words .cards`);
  const handleClickShowing = function () {
    const clickTimeEnd = new Date().getTime();
    if (clickTimeEnd - clickTime < 100 && !isMovingNow) {
      showWordChecker(showingCard().text(), true, false);
    }
  };

  let dragDist = 0;
  let isMovable = true;
  let isMovingNow = false;
  let clickTime = 0;
  let showIndex = 0;

  const values = words().data("values").split("-");
  const cycleFromArr = (arr) => (number) => {
    const { length: len } = arr;
    return ((number % len) + len) % len;
  };
  const cycle = cycleFromArr(values);
  const datasToShow = (showIndex) => [-1, 0, 1].map((e) => values[cycle(e + showIndex)]);
  const insertValuesOnCards = function () {
    cards().each(function (index, card) {
      $(card).html(`<span>${datasToShow(showIndex)[index]}</span>`);
    });
  };

  showingCard().on("touchstart mousedown", function () {
    clickTime = new Date().getTime();
  });
  showingCard().on("touchend mouseup", handleClickShowing);
  insertValuesOnCards();

  const dragStart = function (e) {
    e.preventDefault();
    isDragStarts = true;
    if (e.type == "touchstart") {
      $(document).off("mousedown", dragStart);
      startPoint = e.originalEvent.touches[0].pageX;
    } else {
      startPoint = e.pageX;
    }
    words().on("touchmove mousemove", dragMove);
    showingCard().css("transform", "scale(0.8)");
    showingCard().css("box-shadow", "2px 2px 4px rgba(0, 0, 0, 0.7)");
  };

  const mouseMovesThisPercent = (percent) => Math.abs(dragDist) > percent;
  const checkMovePercent = () => (dragDist = ((movePoint - startPoint) / $("#favorite").width()) * 100);
  const moveWordsAsMouseMoves = () => words().css("left", dragDist - 100 + "%");
  const preventTooManyCall = () => (isMovable = false);
  const animateWords = () => {
    words().css("transition", "all 0.3s");
    words().css("left", `${dragDist > 0 ? 0 : -200}%`);
  };
  const refreshWords = () => {
    words().css("transition", "none");
    words().css("left", "-100%");
  };
  const indexChange = () => (showIndex = cycle(showIndex + (dragDist < 0 ? 1 : -1)));

  function dragMove(e) {
    if (e.type == "touchmove") {
      movePoint = e.originalEvent.touches[0].pageX;
    } else {
      movePoint = e.pageX;
    }
    isMovingNow = true;
    if (isMovable) {
      checkMovePercent();
      if (Math.abs(dragDist) > 1) {
        moveWordsAsMouseMoves();
        if (mouseMovesThisPercent(25)) {
          preventTooManyCall();
          animateWords();
          indexChange();

          showingCard().css("transform", "scale(1)");
          showingCard().css("box-shadow", "2px 2px 8px rgba(0, 0, 0, 0.3)");
          setTimeout(function () {
            refreshWords();
            insertValuesOnCards();
          }, 300);
        }
      }
    }
  }
  const dragEnd = function (e) {
    e.preventDefault();
    words().off("touchmove mousemove", dragMove);
    showingCard().css("transform", "scale(1)");
    showingCard().css("box-shadow", "2px 2px 8px rgba(0, 0, 0, 0.3)");
    isMovingNow = false;
    if (Math.abs(dragDist) < 20) {
      words().css("transition", "all 0.3s");
      words().css("left", "-100%");
      setTimeout(function () {
        words().css("transition", "none");
      }, 300);
    } else {
      isMovable = true;
    }
    dragDist = 0;
  };

  words().on("touchstart mousedown", dragStart);
  words().on("touchend mouseup", dragEnd);
};

const whenHomeOpened = function () {
  wordSlider("favorite");
  wordSlider("recent");
  wordSlider("recap");
};

// Auth animations
const hideHamburger = function () {
  $(".menu-toggle").hide();
};
const whenAuthOpened = function () {
  hideHamburger();
};

if (location.pathname === PATHNAME.HOME) {
  whenHomeOpened();
}
if (location.pathname === PATHNAME.LOGIN) {
  whenAuthOpened();
}
