export interface Song {
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  preview: string;
}

export interface SimilarSongs {
  name: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    image: {
      "#text": string;
      size: string;
    }[];
  };
}