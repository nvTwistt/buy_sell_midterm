$(document).ready(function() {
  const loadMessages = function () {
    $.get("/messages/views", function (res, req) {
      renderMessages(res);
    });
  }
  $(".messageForm").submit(function(event) {
    event.preventDefault();
    const getVal = $("#message-text").val();
    if (getVal.length > 0) {
      $.ajax({
        url: "/messages/views",
        method: "POST",
        data: $("messageForm").serialize(),
      })
      .then(()=> {
        $(".messageForm").empty();
        this.reset();
      })
    }
  });
});