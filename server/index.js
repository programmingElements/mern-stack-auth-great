import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/connect/mongodb.connect.js";

const PORT = process.env.PORT || 4000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port : ${PORT}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection stopped!", err);
})
