const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const asyncHandler = require("../middleware/async");
const sqlDb = require("../models/index");
const axios = require("axios");
const parser = require("xml2json");

// TEST ROUTE
// TO TEST TOKEN
// REMOVE IN PROD
exports.test = asyncHandler(async (req, res, next) => {
  res.status(200).json({ status: "success" });
});

// @desc      Login admin
// @route     POST /api/v1/admin/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(500)
      .json({ status: "error", message: "supply all fields" });
  }

  try {
    if (username !== process.env.ADMIN_USER) {
      return res
        .status(401)
        .json({ status: "error", message: "invalid credentials" });
    }

    if (password !== process.env.ADMIN_PASS) {
      return res
        .status(401)
        .json({ status: "error", message: "invalid credentials" });
    }

    const token = await jwt.sign({ secret: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(200).json({ status: "success", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// @desc      Add user
// @route     POST /api/v1/admin/add
// @access    Private
exports.add = asyncHandler(async (req, res, next) => {
  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "supply all fields" });
  }

  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await sqlDb.User.create({
      username: username,
      password: hash,
      isAdmin: isAdmin,
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    if (error.message == "Validation error") {
      return res
        .status(500)
        .json({ status: "error", message: "User already exists" });
    }
    res.status(500).json({ status: "error", message: "failed to create user" });
  }
});

// @desc      Get users
// @route     GET /api/v1/admin/users
// @access    Private
exports.users = asyncHandler(async (req, res, next) => {
  try {
    const users = await sqlDb.User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    if (!users) {
      return res.status(404).json({ status: "error", message: "no users" });
    }

    res.status(200).json({ status: "success", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
});

// @desc      Delete user
// @route     DELETE /api/v1/admin/users/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(403)
      .json({ status: "error", message: "supply a user id" });
  }
  try {
    const user = await sqlDb.User.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({ status: "success", message: "deleted user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
});

// @desc      Get stream stats
// @route     GET /api/v1/admin/stats
// @access    Private
exports.stats = asyncHandler(async (req, res, next) => {
  try {
    const data = await axios.get("http://197.100.1.236:7080/stats");
    const json = await parser.toJson(data.data);
    const statData = await JSON.parse(json);

    const stats = {
      nginx_version: statData.rtmp.nginx_version,
      uptime: (statData.rtmp.uptime / 3600).toFixed(1),
      stream: {
        name: statData.rtmp.server.application.live.stream.name,
        time: (
          statData.rtmp.server.application.live.stream.time / 60000
        ).toFixed(0),
        bw_in: formatBytes(
          statData.rtmp.server.application.live.stream.bw_in,
          2
        ),
        bytes_in: formatBytes(
          statData.rtmp.server.application.live.stream.bytes_in
        ),
        bw_out: statData.rtmp.server.application.live.stream.bw_out,
        bytes_out: statData.rtmp.server.application.live.stream.bytes_out,
        bw_audio: statData.rtmp.server.application.live.stream.bw_audio,
        bw_video: statData.rtmp.server.application.live.stream.bw_video,
        video: {
          width: statData.rtmp.server.application.live.stream.meta.video.width,
          height:
            statData.rtmp.server.application.live.stream.meta.video.height,
          frame_rate:
            statData.rtmp.server.application.live.stream.meta.video.frame_rate,
          codec: statData.rtmp.server.application.live.stream.meta.video.codec,
        },
        audio: {
          codec: statData.rtmp.server.application.live.stream.meta.audio.codec,
          channels:
            statData.rtmp.server.application.live.stream.meta.audio.channels,
          sample_rate:
            statData.rtmp.server.application.live.stream.meta.audio.sample_rate,
        },
      },
    };

    res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    res.status(500).json({ status: "error", message: "no stream found" });
  }
});

// Functions

function formatBytes(bytes, decimals, binaryUnits) {
  if (bytes == 0) {
    return "0 Bytes";
  }
  var unitMultiple = binaryUnits ? 1024 : 1000;
  var unitNames =
    unitMultiple === 1024 // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
      ? ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
      : ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  var unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
  return (
    parseFloat(
      (bytes / Math.pow(unitMultiple, unitChanges)).toFixed(decimals || 0)
    ) +
    " " +
    unitNames[unitChanges]
  );
}
