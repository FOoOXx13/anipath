import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testAnime() {
  const { default: connectDB } = await import("../lib/mongodb");
  const { Anime } = await import("../lib/models/Anime");

  await connectDB();

  const anime = await Anime.findOne({ mediaId: 21 });

  console.log("Found anime:", anime);
}

testAnime();