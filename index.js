const express = require('express')
const hbs = require('hbs')
const bent = require('bent')
const getBuffer = bent('buffer')
const semver = require('semver')
const path = require('path')
const pakages = require('./package.json').dependencies
const app = express()
const PORT = 3000

app.listen(PORT, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
})

app.set('views', path.join(__dirname + "/views"))
app.set('view engine', 'hbs')

async function getVersionListFromEndpoint(){
    let relesesBuffer = await getBuffer('https://nodejs.org/dist/index.json');
    const jsonRealases = JSON.parse(relesesBuffer)
    return jsonRealases
}

app.get("/dependencies", (req, res) => {
    var array = Object.keys(pakages).map(k => {
        return {key :k , value: pakages[k]}
    })
    res.render('dependencies',{array}) 
});

app.get("/minimum-secure", async(req, res) => {
    
    var versionList = await getVersionListFromEndpoint()
    var minSecure = {}
    versionList.map(ver => {
        if(ver?.security == true){
            if(minSecure["v" + semver.major(ver.version)]){
                if(semver.lt(minSecure["v" + semver.major(ver.version)].version,ver.version)){
                    minSecure["v" + semver.major(ver.version)] = ver
                }    
            }else{
                minSecure["v" + semver.major(ver.version)] = ver
            }
        }
    })
    res.send(minSecure)
})

app.get("/latest-release", async(req, res) => {
    
    var versionList = await getVersionListFromEndpoint()
    var latestReleases = {}
    versionList.map(ver => {
        if(latestReleases["v" + semver.major(ver.version)]){
            if(semver.lt(latestReleases["v" + semver.major(ver.version)].version,ver.version)){
                latestReleases["v" + semver.major(ver.version)] = ver
            }    
        }else{
            latestReleases["v" + semver.major(ver.version)] = ver
        }
        
    })
    res.send(latestReleases)
})

module.exports = app