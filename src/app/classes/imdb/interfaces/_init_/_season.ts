import Episode from "./_episode"

export default interface Season {
    id?: string
    name?: string
    episodes?: Episode[]
}