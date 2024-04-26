// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function runExec(plantCd, EqptId, TagId, dateFrom, dateTo) {
    let prm = {
        pInput: [
            {
                 name : 'P_PLANT_CD',
                 value : `${plantCd}`
            },
            {
                 name : 'P_EQPTID',
                 value : `${EqptId}`
            },
            {
                 name : 'P_TAGID',
                 value : `${TagId}`
            },
            {
                 name : 'P_FROM',
                 value : `${dateFrom}`
            },
            {
                 name : 'P_TO',
                 value : `${dateTo}`
            },
        ],
        pOutput: [],
        procedure: 'DWS_CPV_SEL_MCSDATA_HI_TAG_FROM_TO'
    }
    return (await sendReq(prm))
}

function rdData(app) {
    app.get('/cpvdata', async function (req, res) {
        console.log(req.body)
        let rs = await runExec('1230', 'A-ROC001', '/ASSETS/A_Process/A-ROC001_TQ002.PV', '2024-04-01 00:00:00', '2024-04-30 00:00:00')
        res.status(200).json(rs.recordset)
    })
}

module.exports = { rdData }



