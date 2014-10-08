
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
      $player.attr("data", "http://www.twitch.tv/widgets/live_embed_player.swf?channel=" + channel);
      $(".videoplayer").show();
      $player.find("param[name='flashvars']").attr("hostname=www.twitch.tv&auto_play=true&channel=" + channel);
      expand();
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
        $("#content").html($container);
      }});
  }

  function getHashChannel() {
    var channel = window.location.hash.replace(/^#/, "");
    return channel;
  }

  function collapse(event) {
      $("#content").show();
      $(".collapse").hide();
      $(".expand").show();
      $(".videoplayer").addClass("collapsed")
    }

  function expand() {
    $("#content").hide();
    $(".collapse").show();
    $(".expand").hide();
    $(".videoplayer").removeClass("collapsed")
  }

  function attach() {
    $("body").on("click", "a.collapse", collapse);
    $("body").on("click", "a.expand", expand);
    
    window.onhashchange = function () {
      var channel = event.newURL.match(/#(.*)/)[1];
      setChannel(channel);
    }
  }


  getStreams();
  attach();
  setChannel(getHashChannel());
});
