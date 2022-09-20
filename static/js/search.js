function send_keyword() {
  let keyword = $("#searchInput").val();
  $.ajax({
    type: "POST",
    url: "/search_word",
    async: false,
    data: {
      keyword: keyword,
    },
    success: function (response) {
      if (response.data === "검색 결과가 없습니다.") {
        let temp = `
                    <li>검색 결과가 없습니다.</li>
                `;
        $(".list_word").append(temp);
      } else {
        // const { data } = response;
        // appendList({
        //   data,
        //   selector: ".list_word",
        //   forCallBack: function ({ word, href, intend }) {
        //     return `<li>
        //       <a onclick="dd()">${word}</a>
        //       <span>${intend}</span>
        //     </li>`;
        //   },
        // });
        let words = response.data;
        for (let i = 0; i < words.length; i++) {
          let word = words[i].word;
          let href = words[i].href;
          let intend = words[i].intend;
          let temp = `
                <li><a onclick='dd()'>${word}</a><span>${intend}</span></li>
            `;
          $(".list_word").append(temp);
        }
      }
    },
  });
}

$(document).ready(function () {
  // $('#keyword').blur(function () {
  //     $('.list_word').empty();
  // });

  //키업 딜레이
  var itcdelay = (function () {
    // Function
    var itcTimer = 0;
    return function (callback, ms) {
      clearTimeout(itcTimer);
      itcTimer = setTimeout(callback, ms);
    };
  })();

  //키보드 입력 감지
  $("#searchInput").keyup(function () {
    itcdelay(function () {
      $(".list_word").empty();
      send_keyword();
    }, 180);
  });
});
