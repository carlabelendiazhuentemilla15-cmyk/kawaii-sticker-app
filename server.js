import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from "canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/make-sticker", upload.single("image"), async (req, res) => {
  try {
    const img = await loadImage(req.file.path);
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 80);
    ctx.fill();

    ctx.save();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    ctx.restore();

    ctx.fillStyle = "rgba(255, 182, 193, 0.15)";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(180, 320, 35, 0, Math.PI * 2);
    ctx.arc(330, 320, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FF69B4";
    ctx.beginPath();
    ctx.arc(180, 380, 20, 0, Math.PI * 2);
    ctx.arc(330, 380, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.fillRect(220, 350, 70, 20);

    const buffer = canvas.toBuffer("image/png");
    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Error al crear sticker");
  }
});

app.listen(3000, () => console.log("Servidor funcionando en http://localhost:3000"));
