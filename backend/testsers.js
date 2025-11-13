import sequelize from "./lib/db.js";
import SpeciesDictionary from "./models/speciesDictionary.model.js";

const run = async () => {
  try {
    console.log("Running query...");
    const data = await SpeciesDictionary.findAll({
      where: { status: "published" },
      limit: 1,
    });
    console.log("✅ Query success:", data.length);
  } catch (err) {
    console.error("❌ Query failed:", err);
  } finally {
    await sequelize.close();
  }
};

run();
