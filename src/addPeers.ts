import axios from 'axios'
import fs from 'fs'
import JSON5 from 'json5'
import { detector } from './detector'

const domain = 'oransns.com'
const main = async () => {
    const peersRaw = await axios.get(`https://${domain}/api/v1/instance/peers`)
    const peers: string[] = peersRaw.data
    const cacheRaw = fs.readFileSync('./output/cache.json').toString()
    const cache = JSON.parse(cacheRaw)
    for (const peer of peers) {
        if (cache[peer]) continue
        let alphabet = peer.slice(0, 1)
        if (parseInt(alphabet, 10)) alphabet = '0'
        if (!fs.existsSync(`./resources/${alphabet}`)) fs.mkdirSync(`./resources/${alphabet}`)
        if (fs.existsSync(`./resources/${alphabet}/${peer}`)) continue
        try {
            const det = await detector(null, peer)
            if (!det.success) continue
            fs.mkdirSync(`./resources/${alphabet}/${peer}`)
            console.log('add', det, peer)
            const json = {
                type: det.type
            }
            fs.writeFileSync(`./resources/${alphabet}/${peer}/data.json5`, JSON5.stringify(json))
        } catch {
            continue
        }
        
    }
}
main()