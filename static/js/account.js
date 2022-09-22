// 로그인
function login() {
  let jsonData = {
    id: $("#logInId").val(),
    pw: $("#logInPassword").val(),
  };

  $.ajax({
    type: "POST",
    url: "/login",
    data: JSON.stringify(jsonData),
    dataType: "JSON",
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      alert(response.msg);
      if (response.result === "success") {
        // 전체 사이트에 대해 7일 뒤에 만료되는 쿠키 생성
        $.cookie("mytoken", response.jwt_token, { expires: 7, path: "/" });
        document.location.href = "/";
      }
    },
  });
}

function logout() {
  $.removeCookie("mytoken", { path: "/" });
  document.location.href = "/";
}

function go_signup() {
  //유효성 체크
  let uid = $("#id").val();
  let pw = $("#password").val();
  let confirm = $("#confirm").val();

  //id체크
  if (uid === undefined || uid === "") {
    alert("아이디를 입력하세요!");
    $("#id").focus();
    return false;
  }

  //pw체크
  if (pw === undefined || pw === "") {
    alert("비밀번호를 입력하세요!");
    $("#password").focus();
    return false;
  }

  if (pw === confirm) {
    //비밀번호 일치 시 회원가입
    let jsonData = {
      id: uid,
      pw: pw,
    };

    $.ajax({
      type: "POST",
      url: "/sign_up",
      data: JSON.stringify(jsonData),
      dataType: "JSON",
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        alert(response.msg);
        document.location.href = "/auth";
      },
    });
  } else {
    alert("비밀번호가 일치하지 않습니다!");
    $("#confirm").focus();
    return false;
  }
}

$(document).ready(function () {
  //로그인 확인
  $.ajax({
    type: "POST",
    url: "login_check",
    data: {},
    success: function (response) {
      let responseData = response.loginData;
      //로그인 여부에 따라서 메뉴에 로그인/로그아웃 버튼으로 변경
      if (responseData !== "notlogin") {
        $("#login").attr("href", "").attr("onclick", "logout()").text("로그아웃");
        $("#signup").hide();
      }
    },
  });
});
