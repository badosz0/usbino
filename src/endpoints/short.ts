import { Application } from "express"
import get_short from "../database/get_short"
import update_short from "../database/update_short"
import { Config } from "../types"

export = (app: Application, config: Config) => {
    app.get("/:a?/:b?", async (req, res) => {
        const a = req.params.a
        const b = req.params.b

        if (!a) {
            return res.redirect(config.redirect)
        }
        
        const id = `${b ? a : "all"}-${b ? b : a}`

        const short = await get_short(id)

        if (!short) {
            res
                .status(404)
                .send(config.notfound)
                .end()
        } 
        
        short.usage += 1
        await update_short(short)

        res.redirect(short.link)
    })

    app.get("*", async (req, res) => {
        return res.redirect(config.redirect)
    })
}