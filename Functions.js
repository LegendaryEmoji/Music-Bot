module.exports = {
  async GetRegxp(Type) {
    if (!Type || typeof Type !== "string") return null;

    if (Type === "YtID") {
      return /^[a-zA-Z0-9-_]{11}$/;
    } else if (Type === "YtUrl") {
      return /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    } else if (Type === "YtPlID") {
      return /(PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41}/;
    } else {
      return /https?:\/\/(www.)?youtube.com\/playlist\?list=((PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41})/;
    }
  },
  async Linker(Type) {
    if (Type.toLowerCase() === "Base") {
      return "https://youtube.com/watch?v=";
    } else {
      return `https://youtube.com/watch?v=${Type}`;
    }
  },
  async Player(message, Discord, client, Ytdl, options = {}, db) {
    const Filters = {
      bassboost: "bass=g=20,dynaudnorm=f=200",
      vaporwave: "aresample=48000,asetrate=48000*0.8",
      nightcore: "aresample=48000,asetrate=48000*1.25",
      phaser: "aphaser=in_gain=0.4",
      treble: "treble=g=5",
      normalizer: "dynaudnorm=f=200",
      flanger: "flanger"
    };
    const Db = await client.queue.get(message.guild.id);
    let Seek;
    if (options.Filter) {
      Seek = Db.ExtraTime
        ? Db.Bot.dispatcher.streamTime + Db.ExtraTime
        : Db.Bot.dispatcher.streamTime;
    } else {
      Seek = undefined;
    };

    if (!options.Play) {
      await Db.VoiceChannel.leave() && await client.queue.delete(message.guild.id);
      const Embeded = new Discord.MessageEmbed()
        .setColor(options.Color)
        .setTitle("Queue Ended!")
        .setDescription(
          "Server Queue Has Been Ended, Thanks For Listening To Me <3\n\nPro Tip: You Can Use **24.7** Command To Make It 24/7 :D"
        )
        .setTimestamp();
      return message.channel
        .send(Embeded)
        .catch(() =>
          message.channel.send(
            "Server Queue Has Been Ended, Thanks For Listening To Me <3\n\nPro Tip: You Can Use **24.7** Command To Make It 24/7 :D"
          )
        );
    };

    Db.Bot.on("disconnect", async () => {
      await client.queue.delete(message.guild.id);
    });

    const EcoderFilters = [];
    Object.keys(Db.Filters).forEach(FilterName => {
      if (Db.Filters[FilterName]) {
        EcoderFilters.push(Filters[FilterName]);
      };
    });
    let Encoder;
    if (EcoderFilters.length < 1) {
      Encoder = [];
    } else {
      Encoder = ["-af", EcoderFilters.join(",")];
    };

    const Steam = Ytdl(Db.Songs[0].Link, {
      filter: "audioonly",
      quality: "highestaudio",
      opusEncoded: true,
      seek: Seek / 1000,
      encoderArgs: Encoder,
      highWaterMark: 1 << 30
    });

    setTimeout(async () => {
      if (Db.Steam) Db.Steam.destroy();
      Db.Steam = Steam;

      const Dispatcher = await Db.Bot.play(Steam, {
        type: "opus",
        birate: "auto"
      });

      if (Seek) {
        Db.ExtraTime = Seek;
      } else {
        const PlayEmbed = new Discord.MessageEmbed()
          .setColor(options.Color)
          .setThumbnail(options.Play.Thumbnail)
          .setTitle("Now Playing!")
          .setDescription(`🎶 Now Playing: **${options.Play.Title}**`)
          .setTimestamp();

        await Db.TextChannel.send(PlayEmbed).catch(() =>
          Db.TextChannnel.send(`🎶 Now Playing: **${options.Play.Title}**`)
        );
        Db.ExtraTime = 0;
      };

      await Dispatcher.setVolumeLogarithmic(Db.Volume / 100);

      await Db.Bot.dispatcher
        .on("finish", async () => {
          const Shift = await Db.Songs.shift();
          if (Db.Loop === true) {
            await Db.Songs.push(Shift);
          }

          await module.exports.Player(message, Discord, client, Ytdl, {
            Play: Db.Songs[0],
            Color: require("./config.js").Color
          });
        })
        .on("error", async error => {
          await console.log(error);
          return Db.TextChannel.send(
            "Error: Something Went Wrong From Bot Inside"
          );
        });
    }, 1000);
  },
  async Objector(Song, message) {
    function FD(duration) {
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
    }
    async function FC(Count) {
      if (Count.length === 4) {
        return `${Count[0]} Thousand`;
      } else if (Count.length === 5) {
        return `${Count[0]}${Count[1]} Thousand`;
      } else if (Count.length === 6) {
        return `${Count[0]}${Count[1]}${Count[2]} Thousand`;
      } else if (Count.length === 7) {
        return `${Count[0]} Million`;
      } else if (Count.length === 8) {
        return `${Count[0]}${Count[1]} Million`;
      } else if (Count.length === 9) {
        return `${Count[0]}${Count[1]}${Count[2]} Million`;
      } else if (Count.length === 10) {
        return `${Count[0]} Billion`;
      } else if (Count.length === 11) {
        return `${Count[0]}${Count[1]} Billion`;
      } else if (Count.length === 12) {
        return `${Count[0]}${Count[1]}${Count[2]} Billion`;
      } else if (Count.length === 13) {
        return `${Count[0]} Trillion`;
      } else {
        return Count;
      }
    };
    return {
      ID: Song.videoId,
      Title: Song.title,
      Link: Song.video_url,
      Duration: await FD(Song.lengthSeconds),
      Seconds: Song.lengthSeconds,
      Thumbnail: Song.thumbnail.thumbnails[0].url,
      Author: Song.ownerChannelName,
      AuthorLink: Song.ownerProfileUrl,
      Upload: Song.uploadDate,
      Views: await FC(Song.viewCount || 0),
      Age: Song.age_restricted ? "Yes" : "No",
      Owner: message.author.username
    };
  }
};
