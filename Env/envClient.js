// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function clientEnv() {
    let sesstimePrm = {
        pInput: [],
        pOutput: [],
        procedure: 'DWS_CPV_SEL_CLIENTENV'
    }
    return (await sendReq(sesstimePrm))
}

function envClient(app) {
    app.get('/envclient', async function (req, res) {
        let langBook = await clientEnv()
        res.status(200).json(langBook.recordsets)
    })
}

module.exports = { envClient }



