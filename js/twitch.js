$(document).ready(function() {
  var template = _.template(
    '<li class="channel-item">'
    + '<a href="#<%=channel.name%>"><%=channel.name%></a> '
    + '<a class="game" href="?game=<%=channel.game%>"><%=channel.game%></a>'
    + '<span class="status"><%=channel.status%></span> '
    + '</li>')

  function setChannel(channel) {
    if( channel) {
      var $player = $("#live_embed_player_flash");
      $player.attr("data", "http://www.twitch.tv/widgets/live_embed_player.swf?channel=" + channel);
      $(".videoplayer").show();
      $player.find("param[name='flashvars']").attr("hostname=www.twitch.tv&auto_play=true&channel=" + channel);
      collapse();
    }
  }

  function getStreams() {
    var url = "https://api.twitch.tv/kraken/streams?count=100&callback=?";
    getTwitch(url, function(data) {
        buildlinks(data)
      }
    );
    $("h2").text("Top Streams");
  }

  function buildlinks(data, gameOverride) {
    var $container = $("<ul>");
    if (data) {
      _.each(data.streams, function(stream) {
        if (!_.isUndefined(gameOverride)) {
          stream.channel.game = gameOverride;
        }
        $container.append(template(stream));
      });
    }
    $("#content").html($container);
  }

  function getStreamsByGame(game) {
     var url = "https://api.twitch.tv/kraken/streams?game=" + encodeURIComponent(game)
     + "&count=100&callback=?";
    getTwitch(url, function(data) {
        buildlinks(data, "")
      }
    );
  }


  function getTwitch(url, success) {
     $.ajax({
      url: url,
      dataType: "json",
      accept: "application/vnd.twitchtv.v2+json",
      headers: {
        "Client-ID": "ftlnfo8ihccsy0rivspk6b6vjb9nf91"
      },
      success: success
    });
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

  function gameClick(event) {
    
    var game = stripHash(event.target.text);
    setGame(game);
    window.location.hash = buildArgs(getHashChannel(), game);
    event.preventDefault();
  }

  function setGame(game) {
    $("#content").html("");
    getStreamsByGame(game);
    $("h2").text(game);
  }

  function buildArgs(stream, game) {
    var hash = "#";
    if (stream) {
      hash += stream;
    }

    if (game) {
      hash += "?game=" + game;
    }
    return hash;
  }

  function getHashArgs() {
    args = {};
    var hash = window.location.hash;
    if (hash) {
      var parts = hash.split("?");
      var nameMatch = parts[0].match(/^#(.*)($|\?)/);
      if (nameMatch && nameMatch.length >= 2) {
        args.channel = nameMatch[1];
      }

      if (parts[1]) {
        var gameMatch = parts[1].match(/game=(.*)($|&)/);
        if(gameMatch && gameMatch.length >=2) {
          args.game = gameMatch[1];
        }
      }
    }
    return args;
  }

  function getHashChannel() {
    var hash = window.location.hash;
    if (hash) {
      var match = hash.split("?")[0].match(/^#(.*)($|\?)/);
      if (match && match.length >= 2) {
        return match[1];
      }
    }
  }

  function setStateFromHash() {
    var args = getHashArgs();
    if (args.channel) {
      setChannel(args.channel);
    }
    if (args.game) {
      setGame(args.game);
    } else {
      getStreams();
    }
  }

  function attach() {
    $("body").on("click", "a.collapse", collapse);
    $("body").on("click", "a.expand", expand);
    $("body").on("click", "a.game", gameClick);
    window.onhashchange = setStateFromHash;
  }

  function stripHash(text) {
    return text.replace(/^#/, "")
  }

  attach();
  setStateFromHash();
});
