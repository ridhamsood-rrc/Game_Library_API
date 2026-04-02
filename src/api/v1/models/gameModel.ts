export interface gameModel {
    id?: number,
    title: string,
    genre: string,
    developedBy: string,
    releaseDate: Date,
    updatedAt: Date,
    size: string,
    modes: Array<string>,
    platform: Array<string>,
    rating: number                  
}