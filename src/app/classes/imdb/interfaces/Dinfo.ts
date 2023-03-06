import Language from "./_init_/_language"
import Release from "./_init_/_release"
import Rating from "./_init_/_rating"
import Season from "./_init_/_season"
import Award from "./_init_/_award"

export default interface dInfo {
    id?: string
    review_api_path?: string
    imdb?: string
    contentType?: string
    productionStatus?: string
    title?: string
    image?: string
    images?: string[]
    plot?: string
    rating?: Rating
    award?: Award
    contentRating?: any
    genre?: string[]
    year?: number | null
    runtime?: string | null
    releaseDeatiledl?: Release
    spokenLanguages?: Language[]
    filmingLocations?: any
    actors?: string[]
    directors?: any
    top_credits?: any
    seasons?: Season[]
}