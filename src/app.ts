import express, {Request, Response, NextFunction} from 'express';
import cors from "cors";

import { ExpressError, NotFoundError } from './expressError';

import { authenticateJWT } from "./middleware/auth";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";
import userRoutes from "./routes/users";
import categoryRoutes from "./routes/categories";

import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"))
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);

/** Handle 404 errors */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler */
app.use(function (err: ExpressError, req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: { message, status }
    });
});

export default app;