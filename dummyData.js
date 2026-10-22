
import "dotenv/config";
import dbConnect from "./lib/db.js";
import NoteModel from "./models/note.js";

const dummyData = [
  {
    title: "Learning Next.js Server Components",
    slug: "learning-nextjs-server-components",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    content:
      "Server Components allow us to fetch data directly on the server.",
  },
  {
    title: "Understanding MongoDB and Mongoose",
    slug: "understanding-mongodb-and-mongoose",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    content:
      "MongoDB stores documents inside collections. Mongoose provides schemas and models.",
  },
  {
    title: "My Daily Coding Routine",
    slug: "my-daily-coding-routine",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    content:
      "My daily routine includes solving DSA problems and building web development projects.",
  },
];

async function initDb() {
  await dbConnect();

  await NoteModel.insertMany(dummyData);

  console.log("Dummy data injected!");
}

initDb()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to inject dummy data:", error);
    process.exit(1);
  });
