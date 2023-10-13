const tape = require('tape')
const bent = require('bent')
const getPort = require('get-port')
const nock = require('nock')
const server = require('../index')
const response = require('./response')

const getJSON = bent('json')
const getBuffer = bent('buffer')

// Use `nock` to prevent live calls to remote services

const scope = nock('https://nodejs.org').persist().get('/dist/index.json').reply(200,response)

const context = {}

tape('setup', async function (t) {
	const port = await getPort()
	context.server = server.listen(port)
	context.origin = `http://localhost:${port}`

	t.end()
})

tape('should get dependencies', async function (t) {
	const html = (await getBuffer(`${context.origin}/dependencies`)).toString()
	const bent = html.match(/bent/)[0]
	const express = html.match(/express/)[0]
	const hbs = html.match(/hbs/)[0]
	t.equal(bent, "bent", "should contain bent")
	t.equal(express, "express", "should contain express")
	t.equal(hbs, "hbs", "should contain hbs")
	t.end()
})

tape('should get minimum secure versions', async function (t) {
	const json = await getJSON(`${context.origin}/minimum-secure`)
    const v0minSecure = json[`v0`].version
    const v4minSecure = json[`v4`].version
    t.equal(v0minSecure, 'v0.12.17', 'v0 version should match')
    t.equal(v4minSecure, 'v4.9.0', 'v13 version should match')
    t.end()
})

tape('should get latest-releases', async function (t) {
	const json = await getJSON(`${context.origin}/latest-release`)
    const v14max = json[`v14`].version
    const v13max = json[`v13`].version
    t.equal(v14max, 'v14.21.3', 'v14 version should match')
    t.equal(v13max, 'v13.14.0', 'v13 version should match')
    t.end()
})

// more tests

tape('teardown', function (t) {
	context.server.close()
	t.end()
})
