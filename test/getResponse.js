const bent = require('bent')
const fs = require('fs')
const path = require('path')

const getJSON = bent('json')

const writeResponse = async() => {
    const response = await getJSON("https://nodejs.org/dist/index.json")
    fs.writeFileSync(path.join(__dirname + '/response.json'), JSON.stringify(response   ))
}

writeResponse()