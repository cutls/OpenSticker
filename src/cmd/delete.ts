import fs from 'fs'

const main = () => {
    const deleteLists = fs.readFileSync('./src/cmd/delete.txt').toString().split("\n")
    for (const delRaw of deleteLists) {
        const del = delRaw.replace('no cache:', '')
        const a = del.slice(0, 1)
        fs.unlinkSync(`./resources/${a}/${del}/data.json5`)
        fs.rmdirSync(`./resources/${a}/${del}`)
    }
}

const alphabets = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
]
const empty = () => {

    for (const alphabet of alphabets) {
        if (!fs.existsSync(`./resources/${alphabet}`)) continue
        const dirs = fs.readdirSync(`./resources/${alphabet}`)
        for (const domain of dirs) {
            if (!fs.statSync(`./resources/${alphabet}/${domain}`).isDirectory()) continue
            if (!fs.existsSync(`./resources/${alphabet}/${domain}/data.json5`)) {
                fs.rmdirSync(`./resources/${alphabet}/${domain}`)
            }
        }
    }
}
    empty()