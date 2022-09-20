const PATHNAME = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ADD: "/word/add",
  EXAM: "/word/exam",
  ADDED_LIST: "/word/added_list",
};

const pyBoolToJs = (pyBool) => (pyBool === "True" ? true : false);

const appendList = function ({ data, selector, forCallBack }) {
  let contentToAppend = "";
  for (let i = 0; i < data.length; i++) {
    contentToAppend += forCallBack(data[i]);
  }
  $(selector).append(contentToAppend);
};
