import { NightwatchBrowser } from "nightwatch"
import EventEmitter from "events"

class GetLastTransactionHash extends EventEmitter {
  command (this: NightwatchBrowser, cb: (hash: string) => void): NightwatchBrowser {
    this.api.perform((done) => {
      getLastTransactionHash(this.api, (hash) => {
        cb(hash)
        done()        
        this.emit('complete')
      })
    })
    return this
  }
}

function getLastTransactionHash (browser: NightwatchBrowser, callback: (hash: string) => void) {
  browser.waitForElementPresent('*[data-shared="universalDappUiInstance"]')
  .execute(function () {
    const deployedContracts = document.querySelectorAll('*[data-id="terminalJournal"] > div')
    const last = deployedContracts[deployedContracts.length - 1]
    const id = last.getAttribute('data-id')

    return id.replace('block_tx', '')
  }, [], function (result) {
    const hash = typeof result.value === 'string' ? result.value : null

    callback(hash)
  })
}

module.exports = GetLastTransactionHash
