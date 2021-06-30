$(document).ready(function() {
  console.log("ready");
  const loadMessages = function () {
    $.get("/views", function (res, req) {
      console.log("Silly res: ",res);
      console.log("silly req: ",req);
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
        loadMessages();
        this.reset();
      })
    }
  });
});