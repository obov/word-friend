const showWordChecker = function (value, favorite, complete) {
  
  console.log("showword");
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
        <div class="value"><span id="value">${value}</span></div>
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
    console.log("slide-up");
    $("#wordViewer").addClass("slide-up");
  }, 10);
};

const handleClickWordCard = function (value, favorite, complete) {
  showWordChecker(value, favorite, complete);
};

const handleClickFav = function () {
  console.log("click favorite");
  let $content = $('.content');
  let word = $content.find('span#value').text();
  contentOnOff(word,'like');

  $("#fav").toggleClass("checked");
};
const handleClickComplete = function () {
  console.log("click complete");

  let $content = $('.content');
  let word = $content.find('span#value').text();
  contentOnOff(word,'complete');

  $("#complete").toggleClass("checked");
};

// function content_type(word){

//   let like,complete;

//   $.ajax({
//     type: "GET",
//     url: "/content_type",
//     async: false,
//     data: {
//       'word':word
//     },
//     success: function (response) {
//       like = response.result['like'];
//       complete = response.result['complete'];
//     }
//   });
//   return {'like':like,'complete':complete}
// }

function contentOnOff(word,contentName){
  $.ajax({
    type: "POST",
    url: "/content_change",
    async: false,
    data: {
      'word':word,
      'content':contentName
    },
    success: function (response) {
      console.log(response);
    }
  });
}


