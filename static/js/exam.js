$(document).ready(function () {
  start_exam();
});

function show_intend(index) {
  $.ajax({
    type: "POST",
    url: "/word/exam/show_intend",
    data: { index_give: index },
    success: function (response) {
      window.location.reload();
    },
  });
}

function ready_exam() {
  $.ajax({
    type: "POST",
    url: "/word/exam_ready",
    data: {},
    success: function (response) {
      window.location.reload();
    },
  });
}

function start_exam() {
  $.ajax({
    type: "GET",
    url: "/word/exam_get",
    data: {},
    success: function (response) {
      let rows = response["exams"];
      for (let i = 0; i < rows.length; i++) {
        let word = rows[i]["word"];
        let index = rows[i]["index"];
        let intend = rows[i]["intend"];
        let done = rows[i]["done"];
        let show = rows[i]["show"];
        let temp_html = ``;
        if (done == 0 && show == 0) {
          temp_html = `<div class="turn">${i + 1}/10</div>
                                          <form onsubmit="function(event){event.preventDefault()}">
                                            <div class="word">${word}</div>
                                            <div class="exam-buttons">
                                              <button onclick="show_intend(${index})">뜻 확인</button>
                                            </div>
                                          </form>`;
        } else if (done == 1 && show == 0) {
          temp_html = `<div class="turn">${i + 1}/10</div>
                                          <form onsubmit="function(event){event.preventDefault()}">
                                            <div class="meaning">${intend}</div>
                                            <div class="exam-buttons">
                                                    <button class="meanbox" onclick="exam_pass(${index})">암기완료</button>
                                                    <button class="meanbox" onclick="exam_fail(${index})">재확인</button>
                                                </div>
                                            </div>
                                        </div>`;
        } else {
        }
        console.log(temp_html);
        $("#exam_section").append(temp_html);
      }
    },
  });
}

function exam_pass(index) {
  $.ajax({
    type: "POST",
    url: "/word/exam/pass",
    data: { index_give: index },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}

function exam_fail(index) {
  $.ajax({
    type: "POST",
    url: "/word/exam/fail",
    data: { index_give: index },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}
