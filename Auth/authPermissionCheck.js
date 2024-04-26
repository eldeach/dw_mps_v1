// ======================================================================================== [Import Component] js
const sendReq = require('../Dbc/dbcMsSqlCPV').sendReq;

async function perCheck(userId, MENU_CD) {
    let perCheckPrm = {
        pInput: [
            {
                name: 'P_USER_ID',
                value: `${userId}`
            },
            {
                name: 'MENU_CD',
                value: `${MENU_CD}`
            }
        ],
        pOutput: [
            {
                name: 'P_RESULT'
            }
        ],
        procedure: 'DWS_CPV_SEL_PERCHECK'
    }
    return (await sendReq(perCheckPrm))
}

function authPermissionCheck(app) {
    app.get('/percheck', async function (req, res) {
        if (req.user && req.query.MENU_CD) {
            let rs = await perCheck(req.user, req.query.MENU_CD)
            if (parseInt(rs.output.P_RESULT) === 1) res.status(200).json({ msg: 'PER_01' })
            else res.status(200).json({ msg: 'PER_02' })
        } else {
            res.status(200).json({ msg: 'PER_02' })
        }
    })
}

module.exports = { authPermissionCheck }
