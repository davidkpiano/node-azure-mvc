import { Schema, model } from 'mongoose';

// Create Movie schema
const MovieSchema = new Schema({
    title: {
        type: String,
        required: true,
        // Specifies that the title should be used as a MongoDB text index
        text: true
    },
    releaseDate: Date,
    genre: String,
    price: Number
});

// Create Movie model
const Movie = model('Movie', MovieSchema);

export default Movie;
