$(document).ready(function () {
    start_exam()
});


function show_intend(num) {
    $.ajax({
        type: "POST", url: "/exam/show_intend", data: {num_give: num}, success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

function ready_exam() {
    $.ajax({
        type: "POST", url: "/exam_ready", data: {}, success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}


function start_exam() {
    $.ajax({
        type: "GET", url: "/exam_get", data: {}, success: function (response) {
            let rows = response['exams']
            for (let i = 0; i < 10; i++) {
                let word = rows[i]['word']
                let num = rows[i]['num']
                let intend = rows[i]['intend']
                let done = rows[i]['done']
                let show = rows[i]['show']

                let temp_html = ``
                if (done == 0 && show == 0) {
                    temp_html = `<div style="border: solid 1px gold" class="turn">${i + 1}/10</div>
                                          <form style="border: solid 1px gold" action="">
                                            <div style="border: solid 1px darkblue" class="word">${word}</div>
                                            <div class="exam-buttons">
                                              <button onclick="show_intend(${num})">뜻 확인</button>
                                            </div>
                                          </form>`
                } else if (done == 1 && show == 0) {
                    temp_html = `<div style="border: solid 1px gold" class="turn">${i + 1}/10</div>
                                          <form style="border: solid 1px gold" action="">
                                            <div style="border: solid 1px darkblue" class="word">${intend}</div>
                                            <div class="exam-buttons">
                                                    <button class="meanbox" onclick="exam_pass(${num})">암기완료</button>
                                                    <button class="meanbox" onclick="exam_fail(${num})">재확인</button>
                                                </div>
                                            </div>
                                        </div>`
                } else {

                }
                $('#exam_section').append(temp_html)

            }
        }
    });
}


        function exam_pass(num) {
            $.ajax({
                type: "POST",
                url: "/exam/pass",
                data: {num_give: num},
                success: function (response) {
                    alert(response["msg"])
                    window.location.reload()
                }
            });
        }

        function exam_fail(num) {
            $.ajax({
                type: "POST",
                url: "/exam/fail",
                data: {num_give: num},
                success: function (response) {
                    alert(response["msg"])
                    window.location.reload()
                }
            });
        }