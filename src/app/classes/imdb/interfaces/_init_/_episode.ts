import Rating from "./_rating"

export default interface Episode {
    idx?: number
    no?: string
    title?: string
    image?: string
    image_large?: string
    plot?: string
    publishedDate?: string
    rating: Rating
}