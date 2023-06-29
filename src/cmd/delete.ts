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
main()