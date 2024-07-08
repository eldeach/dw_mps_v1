// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function clientEnv() {
    let sesstimePrm = {
        pInput: [],
        pOutput: [],
        procedure: 'DWS_CPV_SEL_CLIENTLANG'
    }
    let rsPL = await sendReq(sesstimePrm);
    return rsPL
}

function envClientLang(app) {
    app.get('/envclientlang', async function (req, res) {
        console.log(req.user)
        let rs = await clientEnv()
        res.status(200).json(rs.recordsets)
    })
}

module.exports = { envClientLang }



