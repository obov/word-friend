function send_keyword() {
  let keyword = $("#searchInput").val();
  $.ajax({
    type: "GET",
    url: "/search_word",
    async: false,
    data: {
      keyword: keyword
    },
    success: function (response) {
      if (response.data === "검색 결과가 없습니다.") {
        let temp = `
          <div href="#" class="kwd">
            <li class="item">
              <span class="word">검색 결과가 없습니다.</span></br><span class="list">다른 단어를 검색해 보세요!</span>
            </li> 
          </div>
                `;
        $("#list_word").append(temp);
        
        // const { data } = response;
        // appendList({
        //   data,
        //   selector
        // })



      } else {
        const { data } = response;
        
        appendList({
          data,
          selector: "#list_word",
          forCallBack: function ({ word, intend , index}) {
            
            return `
            <div href="#" onclick="insert_word('${keyword}','${index}')" class="kwd">
              <li class="item" data-keyword="${word}">
                <span class="word">${word}</span></br><span class="list">${intend}</span>
              </li>
            </div>
            `;
          },
        });
      }
    },
  });
}


function insert_word(formdata,index){
  
  $.ajax({
    type: "post",
    url: "/insert_word",
    async: false,
    data: {
      'formdata':formdata,
      'index':index
    },
    success: function (response) {
      alert(response.msg);

    }
  });
}

$(document).ready(function () {

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
      $("#list_word").empty();
      send_keyword();
    }, 180);
  });
  
});
