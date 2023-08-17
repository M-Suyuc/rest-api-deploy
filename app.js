const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')

const movies = require('./movies/movies.json')
const { validateMovie, validateParcialMovie } = require('./schemas/movies.js')

// Hay un middleware de cors -> npm i cors-E
const app = express()
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'http://movies.com',
      ]
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
      if (!origin) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
  })
)
app.disable('x-powered-by') // desabilita  el header X-Powered-By: express

// const ACCEPTED_ORIGINS = [
//   'http://localhost:8080',
//   'http://localhost:1234',
//   'http://movies.com',
// ]

// GET
app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*') ------> Arreglar el problema del CORS
  // const origin = req.header('origin')  // forma nativa si no quieres tener un middleware cors
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre } = req.query
  if (genre) {
    const filterMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filterMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  // path-to-regexp
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ messge: 'Movie  not Found' })
})

// POST
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  // return JSON.parse(result.error.message)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  }

  movies.unshift(newMovie)
  res.status(201).json(newMovie)
})

// DELETE
app.delete('/movies/:id', (req, res) => {
  // const origin = req.header('origin') // forma nativa si no quieres tener un middleware cors
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ messge: 'Movie  not Found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

// forma nativa si no quieres tener un middleware cors
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
//   }
//   res.send(200)
// })

// PUT -> Actualiza toda una peliculas
// PATCH -> Actualiza una parte de la peliculas
app.patch('/movies/:id', (req, res) => {
  const result = validateParcialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ messge: 'Movie  not Found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

// Error 404
app.use((req, res) => {
  res.status(404).end('<h1>404</h1>')
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
