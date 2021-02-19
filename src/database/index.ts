import rethinkdb from "rethinkdb"
import { log } from "../utils/logger"
import { Config } from "../types"

export let connection: rethinkdb.Connection | void

export async function connect(config: Config): Promise<void> {
    try {
        connection = await rethinkdb.connect(config.database)
        if (config.logs) log("info", "Connected to database.")
    } catch (e) {
        log("error", `Error while connecting to database: ${e}`)
        process.exit()
    }
}