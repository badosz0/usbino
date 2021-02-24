export interface Config {
    port: string
    url: string
    domain: string
    database: {
        host: string
        port: number
        user: string
        password?: string
        db: string
    }
    admin: string
    id: {
        length: number,
        capital: boolean,
        lower: boolean,
        numbers: boolean
    }
    forcehttps: boolean
    logs: boolean
    panel: string
    redirect: string
    notfound: string
}

export interface Short {
    id: string,
    link: string,
    usage: number,
    createdat: number
    password?: string
}