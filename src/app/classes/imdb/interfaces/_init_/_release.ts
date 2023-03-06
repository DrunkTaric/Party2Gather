interface _releaseLoc {
    country?: string,
    cca2?: string
}

export default interface Release {
    day?: number,
    year?: number,
    month?: number,
    releaseLocation?: _releaseLoc,
    originLocations?: any
}