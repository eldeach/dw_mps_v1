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

async function selMcsdata(PLANT_CD, EQPTID, TAGID, FROM, TO) {
    let prm = {
        pInput: [
            {
                name: 'P_PLANT_CD',
                value: `${PLANT_CD}`
            },
            {
                name: 'P_EQPTID',
                value: `${EQPTID}`
            },
            {
                name: 'P_TAGID',
                value: `${TAGID}`
            },
            {
                name: 'P_FROM',
                value: `${FROM}`
            },
            {
                name: 'P_TO',
                value: `${TO}`
            },
        ],
        pOutput: [

        ],
        procedure: 'DWS_CPV_SEL_MCSDATA_HI_TAG_FROM_TO_AVG_FOR_BATCH'
    }
    return (await sendReq(prm))
}

function trendData(app) {
    //SELECT
    app.get('/trenddatataglist', async function (req, res) {
        let rs = await selMcsdataTaglist(req.query.PLANT_CD)

        if (!(rs.name == "RequestError")) {
            if (rs.output.P_RESULT == "SUCCESS") {
                console.log(rs.recordsets)
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

    app.get('/trenddata', async function (req, res) {
        console.log(req.query)
        if(req.user){
            let PLANT_CD = req.query.PLANT_CD
            let EQPTID = req.query.EQPTID
            let TAGID = req.query.TAGID
            let FROM = req.query.FROM
            let TO = req.query.TO
            let rs = await selMcsdata(PLANT_CD, EQPTID, TAGID, FROM, TO)
            if(!rs.recordsets){
                res.status(200).json([])
            } else {
                res.status(200).json(rs.recordsets[0])
            }
        } else {
            res.status(200).json([])
        }


    })
}

module.exports = { trendData }



