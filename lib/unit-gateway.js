const os = require('os')
const { ServiceBroker } = require('moleculer')
const HTTPServer= require('moleculer-web')

class UnitGateway {
  constructor({ brokerOptions, serviceName, actions, cors, port, build = 1 } = {}) {
    this.brokerOptions = brokerOptions
    this.serviceName = serviceName
    this.actions = actions
    this.cors = cors
    this.port = port || 3000
    this.build = build

    this.broker = new ServiceBroker({
      ...brokerOptions || {},
      nodeID: brokerOptions?.nodeID || `${os.hostname().toLowerCase()}-${serviceName}-${process.pid}`,
    });
  }

  mapActionsAliases(commandsList = []) {
    const actions = {
      favicon: { handler: () => {} },
      root: { handler: () => ({
        serviceName: this.serviceName,
        build: this.build,
        timestamp: new Date().getTime()
      })}
    }
    const aliases = {
      '/': `${this.serviceName}.root`,
      'GET favicon.ico': `${this.serviceName}.favicon`,
    }

    for (const command of commandsList) {
      command.broker = this.broker;
      const { name, method, route, run } = command
      actions[name] = { handler: run.bind(command) }
      aliases[`${method} ${route}`] = `${this.serviceName}.${name}`
    }

    return { actions, aliases }
  }

  init() {
    return new Promise((resolve, reject) => {
      try {
        const actionsAliases = this.mapActionsAliases(this.actions)

        this.broker.createService({
          name: this.serviceName,
          mixins: [HTTPServer],
          actions: actionsAliases.actions,
          settings: {
            port: this.port,
            routes: [
              {
                aliases: actionsAliases.aliases,
                onError(req, res, err) {
                  return onErrorHandler(res, err, this.broker.logger)
                }
              },
            ],
            cors: this.cors || {
              origin: '*',
              methods: [ 'GET', 'OPTIONS', 'POST', 'PUT', 'DELETE' ],
              allowedHeaders: [],
              exposedHeaders: [],
              credentials: false,
              maxAge: 3600
            },
          }
        })

        this.broker.start()
        this.broker.getLogger(this.serviceName).info({
          serviceName: this.serviceName, ...this.brokerOptions
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

function onErrorHandler(res, err, logger) {
  const resErrorData = {
    success: false,
    error: {
      status: err.code,
      code: err.type,
      message: err.message,
      ...err.data
    }
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.writeHead(resErrorData.error?.status || 500)
  res.end(JSON.stringify(resErrorData))
  logger.error(err)
}

module.exports = { UnitGateway }
