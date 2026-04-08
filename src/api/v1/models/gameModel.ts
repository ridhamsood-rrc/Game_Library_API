export interface gameModel {
    id?: number,
    title: string,
    genre: string,
    size: string,
    modes: Array<string>,
    platform: Array<string>,
    rating: number,
    developedBy: string,
    releaseDate: string,
    updatedAt: Date,                  
}