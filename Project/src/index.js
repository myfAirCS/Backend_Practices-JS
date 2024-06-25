//This approach works but it doesn't keep consistency. As it causes mixture of ES6 and CommonJS ;
// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

/* 1st and unprofessiomal approach to connect Database it causes Pollution in index.js file
 Using IFFE  Function .It excecutes itself while program starts without calling it
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("Error", (error) => {
      console.error("Error : ", error.message);
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error in connecting to Database", error.message);
    throw error;
  }
})(); */
