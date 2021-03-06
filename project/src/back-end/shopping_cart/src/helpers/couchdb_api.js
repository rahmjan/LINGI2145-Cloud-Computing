const log = require('debug')('users-d')

const DB = require('nano')(process.env.DB_URL)

function getCart (username) {
  return new Promise((resolve, reject) => {
      DB.get(username, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      }
      else resolve(ok)
    })
  })
}

function insertCart (cart) {
    return new Promise((resolve, reject) => {
        DB.insert(cart, cart._id, (ko, ok) => {
            if (ko) {
                log(ko)
                reject(ko.reason)
            }
            else resolve(ok)
        })
    })
}


module.exports = {
    getCart,
    insertCart
}
