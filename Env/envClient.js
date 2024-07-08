// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function clientEnv() {
    let sesstimePrm = {
        pInput: [],
        pOutput: [],
        procedure: 'DWS_CPV_SEL_CLIENTENV'
    }
    let rsPL = await sendReq(sesstimePrm);
    return rsPL
}

function envClient(app) {
    app.get('/envclient', async function (req, res) {
        let rs = await clientEnv()
        res.status(200).json(rs.recordsets)
    })
}

module.exports = { envClient }



