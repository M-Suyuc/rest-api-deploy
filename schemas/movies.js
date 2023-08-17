const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title  must  be a string',
    required_error: 'Movie title es required',
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({ message: 'Poster must  be a valid URL' }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Crime',
      'Comedy',
      'Drame',
      'Fantasy',
      'Horror',
      'Thriller',
      'Sci-Fi',
    ]),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie  genre  must be an array of enum Genre',
    }
  ),
})

function validateMovie(object) {
  return movieSchema.safeParse(object)
}

function validateParcialMovie(object) {
  return movieSchema.partial().safeParse(object)
  // partial -> es para hacer las todas las opcione sean opcionales -> osea que si no estan esta BIEN y si estan pues las VALIDAS
}

module.exports = {
  validateMovie,
  validateParcialMovie,
}
