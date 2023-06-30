import axios from 'axios'
import fs from 'fs'
import JSON5 from 'json5'
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
const fillName = async () => {
    for (const alphabet of alphabets) {
        if (!fs.existsSync(`./resources/${alphabet}`)) continue
        const dirs = fs.readdirSync(`./resources/${alphabet}`)
        for (const domain of dirs) {
            if (!fs.statSync(`./resources/${alphabet}/${domain}`).isDirectory()) continue
            if (fs.existsSync(`./resources/${alphabet}/${domain}/data.json5`)) {
                const read = fs.readFileSync(`./resources/${alphabet}/${domain}/data.json5`).toString()
                const obj = JSON5.parse(read)
                if (!obj.name && obj.type === 'mastodon') {
                    try {
                        const instanceDataRaw = await axios.get(`https://${domain}/api/v1/instance`, { timeout: 5000 })
                        const instanceData = instanceDataRaw.data
                        const name = instanceData.title
                        if (name.length >= 15) continue
                        console.log(domain, 'is', name)
                        obj.name = name
                        fs.writeFileSync(`./resources/${alphabet}/${domain}/data.json5`, JSON5.stringify(obj))
                    } catch {
                        console.error('Error:', domain)
                        const a = domain.slice(0, 1)
                        fs.unlinkSync(`./resources/${a}/${domain}/data.json5`)
                        fs.rmdirSync(`./resources/${a}/${domain}`)
                        continue
                    }
                } else if (!obj.name && obj.type === 'misskey') {
                    try {
                        const instanceDataRaw = await axios.get(`https://${domain}/nodeinfo/2.0`, { timeout: 5000 })
                        const instanceData = instanceDataRaw.data
                        const name = instanceData.metadata.nodeName
                        if (name.length >= 15) continue
                        console.log(domain, 'is', name)
                        obj.name = name
                        fs.writeFileSync(`./resources/${alphabet}/${domain}/data.json5`, JSON5.stringify(obj))
                    } catch {
                        console.error('Error:', domain)
                        continue
                        const a = domain.slice(0, 1)
                        fs.unlinkSync(`./resources/${a}/${domain}/data.json5`)
                        fs.rmdirSync(`./resources/${a}/${domain}`)
                        continue
                    }
                }
            }
        }
    }
}
fillName()