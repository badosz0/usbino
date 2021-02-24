import { Application, Response } from "express"
import { Config, Short } from "../types"
import path from "path"
import get_shorts from "../database/get_shorts"
import { UID } from ".."
import { generate_string } from "../utils/string"
import create_short from "../database/create_short"
import get_short from "../database/get_short"
import remove_short from "../database/remove_short"
import { log } from "../utils/logger"

function error(res: Response, message: string): Response {
    return res
        .status(400)
        .json({error: message})
}

export = (app: Application, config: Config) => {
    app.get(`/${config.panel}`, async (req, res) => {
        const shorts = await get_shorts()
        
        return res
            .status(200)
            .render(path.join("../public/pages/index.ejs"), {
                shorts, UID
            })
    })

    app.post("/add", async (req, res) => {
        const id = req.body.id || generate_string(config.id.length, config.id.capital, config.id.lower, config.id.numbers)
        let link = req.body.link as string
        const folder = req.body.folder || "all"
        const password = req.body.password
        const verify = req.body.verify

        if (verify != UID) {
            return error(res, "Invalid verify ID.")
        }

        if (!link) {
            return error(res, "Link was not provided.")
        }

        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            link = `http${config.forcehttps ? "s" : ""}://${link}`
        }
        
        link = link.replace("www.", "")

        try {
            new URL(link)
        } catch (_) {
            return error(res, "Invalid link.")
        }

        const short: Short = {
            id: folder as string + "-" + id as string,
            link: link,
            usage: 0,
            createdat: Date.now()
        }

        if (password) {
            short.password = password
        }

        const exists = await get_short(short.id)

        if (exists) {
            return error(res, "Short already exists.")
        }

        await create_short(short)
        log("info", `Created short: ${short.id}`)

        return res
            .status(200)
            .json(short)
    })

    app.post("/remove", async (req, res) => {
        const verify = req.body.verify
        const id = req.body.id as string || ""
        
        if (verify != UID) {
            return error(res, "Invalid verify ID.")
        }
        
        const short = await get_short(id)

        if (!short) {
            return error(res, "Short does not exist.")
        }

        await remove_short(id)
        log("info", `Removed short: ${short.id}`)

        return res
            .status(200)
            .json(short)
    })
}