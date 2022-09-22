$(document).ready(function () {
    date_word();
});

function date_word() {
    $.ajax({
        type: "GET",
        url: "/added_list",
        data: {},
        success: function (response) {
            let rows = response['all_favorites']
            for (let i = 0; i < rows.length; i++) {
                let word = rows[i]['word']
                let temp_html = `<ul>${word}</ul>` /* 추가할 html */

                $('#words').append(temp_html)  /* id가 words인 태그 안에 추가 */

            }


        }
    })
}