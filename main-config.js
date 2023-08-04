const nodeEnv  = process.env?.NODE_ENV || ''
const isDev = ['dev', ''].includes(nodeEnv)

module.exports = {
  defaultBrokerOptions: {
    namespace: isDev ? 'local' : nodeEnv,
    transporter: 'NATS',
    logger: isDev ? { type: 'console' } : {type: 'pino', options: {level: 'info'}},
  },
  units: {
    gateway: { name: 'gateway' },
    auth: { name: 'auth' },
    posts: { name: 'posts' },
    blogs: { name: 'blogs' },
    users: { name: 'users' },
  }
}
