const loadDb = require('./ld')
const model = require('./model/userModel')
loadDb.loadData('Natours-Local-DB',model, './dev-data/data/users.json')