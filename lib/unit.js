const os = require('os');
const { ServiceBroker } = require('moleculer');

class Unit {
  constructor({ brokerOptions, serviceName, actions } = {}) {
    this.brokerOptions = brokerOptions
    this.serviceName = serviceName
    this.actions = actions

    this.broker = new ServiceBroker({
      ...brokerOptions || {},
      nodeID: brokerOptions?.nodeID || `${os.hostname().toLowerCase()}-${serviceName}-${process.pid}`
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      try {
        this.broker.createService({
          name: this.serviceName,
          actions: this.actions || {}
        })

        this.broker.start()
        this.broker.getLogger(this.serviceName).info({
          serviceName: this.serviceName, ...this.brokerOptions
        })
      } catch (e){
        reject(e)
      }
    })
  }
}

module.exports = { Unit }
