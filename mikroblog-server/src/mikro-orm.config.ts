import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[/w-]+\d+\.ts$/,
    },
    entities: [Post, User],
    allowGlobalContext: true,
    type: "postgresql",
    dbName: "mirkodb",
    password: "123qwe",
    debug: true,
} as Parameters<typeof MikroORM.init>[0];