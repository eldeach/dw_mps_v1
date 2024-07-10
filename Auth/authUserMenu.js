// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;


async function getUserMenu(USER_ID, PLANT_CD) {
    let perCheckPrm = {
        pInput: [
            {
                name: 'P_USER_ID',
                value: `${USER_ID}`
            },
            {
                name: 'PLANT_CD',
                value: `${PLANT_CD}`
            }
        ],
        pOutput: [
            {
                name: 'P_RESULT'
            }
        ],
        procedure: 'DWS_CPV_SEL_USER_MENU'
    }
    return (await sendReq(perCheckPrm))
}


async function authUserMenu(app){
    app.get('/usermenu', async function (req, res) {
        if (req.user && req.query.PLANT_CD) {
            let rs = await getUserMenu(req.user, req.query.PLANT_CD)
            res.status(200).json(rs.recordsets)
        } else {
            res.status(200).json({ msg: 'PER_03' })
        }
    })
}

module.exports = {authUserMenu}