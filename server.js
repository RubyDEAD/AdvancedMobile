const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("YouTube URL required");

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_"); // sanitize filename

    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

app.listen(5000, () => console.log("🎵 Server running on http://localhost:5000"));
