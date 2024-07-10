// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function getEnvClientLang() {
    let sesstimePrm = {
        pInput: [],
        pOutput: [],
        procedure: 'DWS_CPV_SEL_ENVCLIENTLANG'
    }
    let rsPL = await sendReq(sesstimePrm);
    return rsPL
}

function envClientLang(app) {
    app.get('/envclientlang', async function (req, res) {
        let rs = await getEnvClientLang()
        res.status(200).json(rs.recordsets)
    })
}

module.exports = { envClientLang }



