import app from "./app";
import { PORT } from "./config";

app.listen(PORT, function()  {
    console.log(`server started on http://localhost:${PORT}`);
});