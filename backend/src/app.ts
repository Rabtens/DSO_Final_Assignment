import express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import knex from 'knex'
import cors from 'cors'
import { errorHandler } from './utils'
import { NotFoundError } from './errors'
import { PRODUCTION, JWT_SECRET, REFRESH_JWT_SECRET } from './constants'
import routes from './routes'
import { databaseConfig } from './config'
import HTTP_CODE from './errors/httpCodes'
import dotenv from 'dotenv'
dotenv.config()

// Environment execution info
console.log(`Running in ${PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'} mode\n`)

// Test database connection
const knexConnection = knex(databaseConfig)
knexConnection.raw(`
SELECT table_name
FROM information_schema.tables
WHERE table_schema='public';
`)
  .then((data) => {
    console.log(data.rows)
    console.log('\nDatabase connection successful\n')
  })
  .catch((error) => {
    console.error('\nDatabase connection error')
    console.error(error)
  })

// Start express app
const app = express()

app.set('JWT_SECRET', JWT_SECRET)
app.set('REFRESH_JWT_SECRET', REFRESH_JWT_SECRET)

app.disable('x-powered-by')
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

export const API_PREFIX = '/api'

// Static file serving
app.use(`${API_PREFIX}/public`, express.static('public'))
app.use(`${API_PREFIX}/uploads`, express.static('uploads'))

// Root endpoint - handles requests to "/"
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Backend API is running successfully!',
    status: 'healthy',
    apiPrefix: API_PREFIX,
    availableEndpoints: `${API_PREFIX}/*`,
    environment: PRODUCTION ? 'production' : 'development'
  })
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use(API_PREFIX, routes)

// Debug: Log registered routes (optional - remove in production)
if (!PRODUCTION) {
  console.log('\nRegistered routes:')
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase()
      console.log(`${methods} ${middleware.route.path}`)
    } else if (middleware.name === 'router') {
      // For router middleware, log the base path
      console.log(`Router mounted at: ${middleware.regexp.source}`)
    }
  })
  console.log('')
}

// 404 Not Found Errors
app.use(errorHandler((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError('Endpoint not Found')
}))

interface ExpressError extends Error {
  status?: number
  errors?: any
  additionalInfo?: any
}

// 500 Internal Errors
app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  const isUnexpectedError = err.status === undefined
  console.log('Error occurred:', err.message)
  console.log('Error stack:', err.stack)
  
  res.status(err.status || HTTP_CODE.INTERNAL_ERROR)
  res.json({
    // For unexpected errors in production, hide the message since it could contain relevant info
    message: (isUnexpectedError && PRODUCTION) ? 'Internal error' : err.message,
    errors: err.errors,
    ...(err.additionalInfo || {}),
  })
})

export default app