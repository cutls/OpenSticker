import Jimp from 'jimp'
import axios from 'axios'
import superagent from 'superagent'
import cheerio from 'cheerio'
import url from 'url'
import { IType } from '../interfaces/config'

export const detector = async (type: IType | null, domain: string) => {
    let file = null
	if (!type) type = await detect(domain)
	if (!type) throw { success: false }
	const result = await axios.get(`https://${domain}`, { timeout: 10000, responseType: 'text' })
	const $ = cheerio.load(result.data)
	file = $('link[rel=icon]').attr('href')
	if (!file) file = 'favicon.ico'
	file = url.resolve(`https://${domain}`, file)
	if (!file) throw { success: false }
	const gotimg = await Jimp.read(`https://images.weserv.nl/?url=${file}&output=png&w=50`)
	const compared = await getCompared(type)
	const diff = Jimp.distance(gotimg, compared)
	const isDefault = diff < 0.3
    return { success: true, difference: diff, type: type, isDefault: isDefault, url: file }
}
async function getCompared(type: null | string) {
	let file
	if (type == 'mastodon') file = 'mastodon.png'
	if (type == 'pleroma') file = 'pleroma.png'
	if (type == 'misskey') file = 'misskey.png'
	if (type == 'misskeylegacy') file = 'misskeyv11.png'
	if (type == 'pixelfed') file = 'pixelfed.png'
	const res = await Jimp.read('assets/' + file)
	const resized = res.resize(50, Jimp.AUTO)
	return resized
}
async function detect(domain: string) {
	let type: IType
	try {
		const donOrKey = await axios.get(`https://${domain}/favicon.ico`, { timeout: 5000 })
		if (donOrKey.headers['content-type'] == 'text/html; charset=utf-8') throw 0
		try {
			const mastodon = await axios.get(`https://${domain}/api/v1/instance`, { timeout: 5000 })
			type = 'mastodon'
		} catch {
			//Misskeyである可能性
			try {
				const misskey = await axios.post(`https://${domain}/api/meta`, { timeout: 5000 })
				//13以降の動向が不明
				let v11 = false
				let data = misskey.data
				if (!data.version.match(/12\.[0-9]{1,}\.[0-9]{1,}/)) v11 = true
				type = 'misskey'
				if (v11) type = 'misskeylegacy'
			} catch (e) {
				type = null
			}
		}
	} catch {
		try {
			const isFedi = await axios.get(`https://${domain}/api/v1/instance`, { timeout: 5000 })
			try {
				const pleroma = await axios.get(`https://${domain}/favicon.png`, { timeout: 5000 })
				//Pleroma
				type = 'pleroma'
			} catch {
				//PixelFed
				type = 'pixelfed'
			}
		} catch {
			type = null
		}
	}
	return type
}
