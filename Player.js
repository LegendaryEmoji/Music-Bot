const Sr = require("youtube-sr").default, Dl = require("@distube/ytdl"), SP = require("spotify-url-info"), FB = require("fbdl-core"), Discord = require("discord.js"), Fetch = require("node-fetch").default;

const Regex = {
  VideoID: /^[a-zA-Z0-9-_]{11}$/,
  VideoURL: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
  PlaylistID: /(PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41}/,
  PlaylistURL: /https?:\/\/(www.)?youtube.com\/playlist\?list=((PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41})/,
  SCTrack: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/?$/,
  SCPlaylist: /^https?:\/\/(soundcloud\.com|snd\.sc)\/([A-Za-z0-9_-]+)\/sets\/([A-Za-z0-9_-]+)\/?$/,
  Spotify: /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/,
  Facebook: /(https?:\/\/)(www\.|m\.)?(facebook|fb).com\/.*\/videos\/.*/
};

async function Type(Value) {
  /**
   * T => Type
   * L => Link
   */
  if (Regex.VideoID.test(Value)) return { T: "YT", L: `https://www.youtube.com/watch?v=${Regex.VideoID.exec(Value)[0]}` };
  if (Regex.VideoURL.test(Value) && !Value.toLowerCase().includes("list")) return { T: "YT", L: Value };
  if (Regex.PlaylistID.test(Value) && !Value.startsWith("http")) return { T: "YTPL", L: `https://www.youtube.com/playlist?list=${Value}` };
  if (Regex.PlaylistURL.test(Value)) return { T: "YTPL", L: Value };
  if (Regex.SCTrack.test(Value)) return { T: "SC", L: Value };
  if (Regex.SCPlaylist.test(Value)) return { T: "SCPL", L: Value };
  if (Regex.Spotify.test(Value) && Value.toLowerCase().includes("track")) return { T: "SP", L: Value };
  if (Regex.Spotify.test(Value) && Value.toLowerCase().includes("playlist")) return { T: "SPPL", L: Value };
  if (Regex.Facebook.test(Value)) return { T: "FB", L: Value };

  const Data = await Sr.searchOne(Value);

  if (!Data) return undefined;

  return { T: "YT", L: `https://www.youtube.com/watch?v=${Data.id}` }
};

async function GetInfo(Query, message) {
  const T = await Type(Query);
  let Final, Info;
  if (!T) return undefined;
  if (T.T == "YT") {
    Info = await Dl.getInfo(T.L);
    if (!Info) return undefined;
    Info = await MakeSong(Info.videoDetails, message, Info), Info.P = false;
    return Info;
  } else if (T.T == "SC") {
    Info = await message.client.SC.getSongInfo(T.L);
    if (!Info) return undefined;
    Info = await MakeSong(Info, message, Info, { Type: "SC" }), Info.P = false;
    return Info;
  } else if (T.T == "SP") {
    Info = await SP.getData(T.L);
    if (!Info) return undefined;
    Info = { Type: "SP", ID: Info.id, Title: Info.name, Audio: Info.preview_url, Req: message.author.username, Other: Info, Link: Info.external_urls.spotify, Duration: await FD(Info.duration_ms, "ms") }; await MakeSong(Info, message, Info, { Type: "SP" }), Info.P = false;
    return Info;
  } else if (T.T == "FB") {
    Info = await FB.getInfo(T.L);
    if (!Info) return undefined;
    Info = await MakeSong(Info, message, Info, { Type: "FB" }), Info.P = false;
    return Info;
  } else if (["YTPL", "SCPL"].includes(T.T)) {
      Info = T.T == "YTPL" ? await Sr.getPlaylist(T.L) : await message.client.SC.getPlaylist(T.L);
      if (!Info) return undefined;
      const Songs = [], Type = {
        YTPL: "videos",
        SCPL: "tracks"
      };
      for (let Element of Info[Type[T.T]]) {
        const SInfo = await MakeSong(Element, message, Element, { Type: T.T == "YTPL" ? "SR" : "SC" });
        if (typeof SInfo != "undefined") Songs.push(SInfo);
      };
      Final = {
        P: true,
        Name: Info.title,
        Thumbnail: Info.thumbnail,
        Count: Info[T.T == "YTPL" ? "videoCount" : "trackCount"],
        Views: Info.views || 0,
        Link: Info.url,
        Videos: Songs,
        Other: Info
      };

    return Final;
  } else if (T.T == "SPPL") {
    try {
    Info = await SP.getData(T.L);
    } catch(e) {
      return undefined;
    };
    if (!Info) return undefined;
    const Songs = [];
    for (let Element of Info.tracks.items) {
      const Data = Element.track;
      Songs.push({ Type: "SPPL", ID: Data.id, Title: Data.name, Audio: Data.preview_url, Link: Data.external_urls.spotify, Req: message.author.username, Other: Data });
    };
    if (!Songs) return undefined;
    Final = {
      P: true,
      Name: Info.name,
      Thumbnail: Info.images[0].url,
      Link: Info.external_urls.spotify,
      Count: Info.tracks.items.length,
      Views: Info.followers.total,
      Videos: Songs,
      Other: Info
    };
    return Final;
  };
};

async function MakeSong(Song, message, all, options = {}) {
  const Link = Song.video_url ? Song.video_url : Song.id && !isNaN(Song.id) ? Song.url : Song.url ? Song.url : `https://www.youtube.com/watch?v=${Song.id}`;
  const Thumbnail = Song.thumbnails ? Song.thumbnails[0].url : Song.thumbnail ? Song.thumbnail.url ? Song.thumbnail.url : Song.thumbnail : Song.image;
  let Duration;
  if (Song.lengthSeconds || !String(Song.duration).includes(":")) {
    Duration =  await FD(Song.lengthSeconds || Song.duration, Song.duration ? "ms" : " ");
  } else {
    Duration = Song.duration;
  };
  return {
    Type: options.Type || "YT",
    ID: Song.videoId || Song.id,
    Title: Song.title,
    Audio: Song.audio,
    Req: message.author.username,
    Other: all,
    Thumbnail,
    Duration,
    Link
  };
};

async function FD(duration, type = " ") {
    if (type == "ms") duration = duration / 1000;
    let minutes = Math.floor(duration / 60);
    let hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
    }
    duration = Math.floor(duration % 60);
    duration = duration >= 10 ? duration : "0" + duration;
    if (hours != "") {
        return hours + ":" + minutes + ":" + duration;
    }
    return minutes + ":" + duration;
};

async function AllFilters(Queue) {
  let EncodeFilters = [],
    Encoder = [];

  for (let Filter of Object.keys(Queue.Filters)) {
    if (Queue.Filters[Filter]) {
      EncodeFilters.push((await Filters())[Filter]);
    };
  };

  if (EncodeFilters.length < 1) {
    Ecoder = [];
  } else {
    Encoder = ["-af", EncodeFilters.join(",")];
  };

  return Encoder;
};

async function HandleVoice(message, client) {
  const Queue = await client.queue.get(message.guild.id);
  
  await Queue.Connection.on("disconnect", () => {
    client.queue.delete(message.guild.id);
  });
  
  await Queue.Connection.dispatcher
    .on("finish", async () => {
      const Shift = await Queue.Songs.shift();
      if (Queue.Loop == true) await Queue.Songs.push(Shift);
      await Player(client, message, { Song: Queue.Songs[0] });
    })
    .on("error", async (error) => {
      console.log(error);
      return Queue.Text.send("Something Went Wrong, Try Again Later!");
    });
};

async function Player(client, message, options = {}) {
  const queue = await client.queue.get(message.guild.id), Encoder = await AllFilters(queue);
  const Seek = options.Filter ? queue.ExtraTime ? queue.Connection.dispatcher.streamTime + queue.ExtraTime : queue.Connection.dispatcher.streamTime : undefined;

  if (queue.Steam) queue.Steam.destroy();
  if (!options.Song) {
      await queue.Voice.leave() && await client.queue.delete(message.guild.id);
      const End = new Discord.MessageEmbed()
      .setColor(client.Color)
      .setAuthor("Queue Ended", message.author.avatarURL({ dynamic: true }))
      .setDescription("Queue Has Been Ended, Please Add More Songs")
      .setTimestamp();
      return message.channel.send(End);
  };

  const Bitrates = client.ws.ping <= 20 ? 513000 : client.ws.ping <= 40 ? 128000 : client.ws.ping <= 60 ? 96000 : 64000;
  let Steam, Dispatcher, Link, Type, option = {
      opusEncoded: true,
      filter: "audioonly",
      dlChunkSize: 0,
      quality: "highestaudio",
      seek: Seek / 1000,
      encoderArgs: Encoder,
      highWaterMark: 1 << 25
  };

  if (options.Song.Type == "SR" || options.Song.Type == "YT") {
    options.Song.Type == "SR" ? options.Song.Other = await Dl.getInfo(options.Song.Link) : null;
    Link = options.Song.Other, Type = "SR", option["filter"] = options.Song.Other.videoDetails.isLiveContent ? "audioandvideo" : "audioonly";
  } else if (options.Song.Type == "SC") {
    Link = await options.Song.Other.downloadProgressive(), Type = "AR";
  } else if (options.Song.Type == "SP") {
    Link = options.Song.Audio, Type = "AR";
  } else if (options.Song.Type == "SPPL") {
    const Data = await SP.getPreview(options.Song.Link);
    if (!Data) return message.channel.send("Error: No Playlist Found!");
    options.Song = await MakeSong(Data, message, Data, { Type: "SP" });
    Link = options.Song.Audio, Type = "AR";
  } else if (options.Song.Type == "FB") {
    const buffer = await FB.download(options.Song.Link);
    if (!buffer) return message.channel.send("Error: No Song Found!");
    Link = buffer, Type = "AR";
  };

  Steam = Type == "SR" ? await Dl.downloadFromInfo(Link, option) : Type == "AR" ? await Dl.arbitraryStream(Link, option) : undefined;
  if (!Steam) return message.channel.send("Error: Something Went Wrong, Try Again Later!");
  Dispatcher = await queue.Connection.play(Steam, {
    volume: queue.Volume / 100,
    type: "opus",
    bitrate: Bitrates
  });

  queue.Steam = Steam;

  if (Seek) {
    queue.ExtraTime = 0;
  } else {
    const Embed = new Discord.MessageEmbed()
    .setColor(client.Color)
    .setAuthor("Playing", message.author.avatarURL({ dynamic: true }))
    .setThumbnail(queue.Songs[0].Thumbnail)
    .setDescription(`Now Playing - [${queue.Songs[0].Title}](${queue.Songs[0].Link})`)
    .setFooter(`Requested By ${message.author.username}`)
    queue.Text.send(Embed);
    Dispatcher.setVolumeLogarithmic(queue.Volume / 100);
    queue.ExtraTime = 0;
  };

  return HandleVoice(message, client);
};

async function Filters() {
  return {
      bassboost: "bass=g=10,dynaudnorm=f=150",
      vaporwave: "aresample=48000,asetrate=48000*0.8",
      nightcore: "aresample=48000,asetrate=48000*1.25",
      aphaser: "aphaser",
      apulsator: "apulsator",
      asetrate: "asetrate",
      speed: "atempo=2",
      superspeed: "atempo=3",
      slow: "atempo=0.8",
      superslow: "atempo=0.5",
      deesser: "deesser=i=1",
      phaser: "aphaser=in_gain=0.4",
      subboost: "asubboost",
      treble: "treble=g=5",
      tremolo: "tremolo",
      normalizer: "dynaudnorm=f=200",
      pulsator: "apulsator=hz=1",
      flanger: "flanger",
      vibrato: "vibrato=f=6.5",
      karaoke: "stereotools=mlev=0.1",
      reverse: "areverse",
      gate: "agate",
      mcompand: "mcompand",
      echo: "aecho=0.8:0.9:1000:0.3",
      earwax: "earwax",
      surround: "surround",
      haas: "haas",
      mono: "pan=mono|c0=.5*c0+.5*c1",
      sofalizer: "sofalizer",
      "8D": "apulsator=hz=0.08",
      "3D": "apulsator=hz=0.125"
  };
};

module.exports = {
  Type, GetInfo, Player, Filters, MakeSong
};