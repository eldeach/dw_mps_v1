// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function selMcsdataTaglist(plantCd) {
    let prm = {
        pInput: [
            {
                name: 'P_PLANT_CD',
                value: `${plantCd}`
            },
        ],
        pOutput: [
            {
                name: 'P_RESULT'
            },
            {
                name: 'P_VALUE'
            }
        ],
        procedure: 'DWS_CPV_SEL_MCSDATA_TAGLIST'
    }
    return (await sendReq(prm))
}

function mcsdata(app) {
    //SELECT
    app.get('/reqmcsdatataglist', async function (req, res) {
        let rs = await selMcsdataTaglist(req.query.PLANT_CD)

        if (!(rs.name == "RequestError")) {
            if (rs.output.P_RESULT == "SUCCESS") {
                res.status(200).json(rs)
            } else if (rs.output.P_RESULT == "ERROR") {
                res.status(200).json(rs)
            }
        } else {
            let rserr = {
                output: {
                    P_RESULT: "ERROR",
                    P_VALUE: {
                        ERROR_NUMBER: `${rs.number}`,
                        ERROR_SEVERITY: `${rs.class}`,
                        ERROR_STATE: `${rs.state}`,
                        ERROR_PROCEDURE: `${rs.procName}`,
                        ERROR_LINE: `${rs.lineNumber}`,
                        ERROR_MESSAGE: `${rs.message}`
                    }
                },
            }
            res.status(200).json(rserr)
        }
    })
}

module.exports = { mcsdata }



