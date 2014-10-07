
$(document).ready(function() {
  var template = _.template(
    '<li class="channel-item">'
    + '<a href="#<%=channel.name%>"><%=channel.name%></a> '
    // + '<a href="#<%=channel.game%>"><%=channel.game%></a> '
    + '<span class="game"><%=channel.game%></span>'
    + '<span class="status"><%=channel.status%></span> '
    + '</li>')

  function setChannel(channel) {
    if( channel) {
      var $player = $("#live_embed_player_flash");
      $player.attr("data", "http://www.twitch.tv/widgets/live_embed_player.swf?channel=" + channel)
        .width("100%")
      $(".videoplayer").show();

      $player.find("param[name='flashvars']").attr("hostname=www.twitch.tv&auto_play=true&channel=" + channel);
    }
  }

  function getStreams() {
    var url = "https://api.twitch.tv/kraken/streams?count=100&callback=?";
    $.ajax({
      url: url,
      dataType: "json",
      accept: "application/vnd.twitchtv.v2+json",
      headers: {
        "Client-ID": "ftlnfo8ihccsy0rivspk6b6vjb9nf91"
      },
      success: function(data) {
        var $container = $("<ul>");
        if(data) {
          _.each(data.streams, function(stream) {
            $container.append(template(stream));
          });
        }
        $("body").append($container);
      }});
  }

  function getHashChannel() {
    var channel = window.location.hash.replace(/^#/, "");
    return channel;
  }



  function attach() {
    $("body").on("click", "a.collapse", function(event) {
      $(".collapse").hide();
      $(".expand").show();
      $(".videoplayer").addClass("collapsed")
    });

    $("body").on("click", "a.expand", function(event) {
      $(".collapse").show();
      $(".expand").hide();
      $(".videoplayer").removeClass("collapsed")
    });
    
    window.onhashchange = function () {
      setChannel(event.newURL.replace(/^#/, ""));
    }
  }


  getStreams();
  attach();
  setChannel(getHashChannel());
});
