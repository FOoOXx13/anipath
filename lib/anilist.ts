export type MediaType = "ANIME" | "MANGA";

export interface PageInfo {
  currentPage: number;
  hasNextPage: boolean;
  lastPage: number;
}

export interface Media {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
    color?: string | null;
  };
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  season?: string | null;
  seasonYear?: number | null;
  genres?: string[];
}
export interface MediaDetails {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    color?: string;
  };
  description?: string;
  episodes?: number;
  chapters?: number;
  volumes?: number | null;
  format?: string;
  status?: string;
  genres?: string[];
  bannerImage?: string;
  averageScore?: number;
  popularity?: number;
  season?: string;
  seasonYear?: number;
  duration?: number;
  source?: string;
  hashtag?: string;
  synonyms?: string[];

  startDate: {
    year?: number;
    month?: number;
    day?: number;
  };

  endDate: {
    year?: number;
    month?: number;
    day?: number;
  };

  studios?: {
    nodes: Array<{
      id: number;
      name: string;
    }>;
  };

  producers?: {
    nodes: Array<{
      id: number;
      name: string;
    }>;
  };

  externalLinks?: Array<{
    site: string;
    url: string;
    icon?: string;
  }>;

  trailer?: {
    id: string;
    site: string;
    thumbnail?: string;
  };

  relations?: {
    edges: Array<{
      relationType: string;
      node: {
        id: number;
        status?: string;
        type?: string;
        title: {
          romaji?: string;
        };
        format?: string;
        coverImage?: {
          large?: string;
        };
      };
    }>;
  };

  characters?: {
    edges: Array<{
      role?: string;
      node: {
        id: number;
        name: {
          full?: string;
        };
        image?: {
          medium?: string;
        };
      };
    }>;
  };

  staff?: {
    edges: Array<{
      role?: string;
      node: {
        id: number;
        name: {
          full?: string;
        };
        image?: {
          medium?: string;
        };
      };
    }>;
  };
}

const ANILIST_URL = "https://graphql.anilist.co";

export async function searchMedia(query: string, type: MediaType) {
  const gql = `
    query ($search: String, $type: MediaType) {
      Page(perPage: 50) {
        media(
          search: $search
          type: $type
          sort: [POPULARITY_DESC]
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
             color
          }
          format
          seasonYear
          genres
        }
      }
    }
  `;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: gql,
      variables: { search: query, type },
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  return json.data.Page.media as Media[];
}



function getNextSeason() {
  const month = new Date().getMonth() + 1;

  let season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  let year = new Date().getFullYear();

  if (month >= 1 && month <= 3) {
    season = "SPRING";
  } else if (month >= 4 && month <= 6) {
    season = "SUMMER";
  } else if (month >= 7 && month <= 9) {
    season = "FALL";
  } else {
    season = "WINTER";
  }

  // If going from FALL → WINTER of next year
  if (season === "WINTER" && month >= 10) {
    year += 1;
  }

  return { season, year };
}

export async function fetchTrendingMedia(page: number, type: MediaType): Promise<Media[]> {
  const query = `
    query ($page: Int, $perPage: Int, $type: MediaType) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: $type
          sort: TRENDING_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
             color
          }
          episodes
          chapters
          volumes
          season
          seasonYear
          genres
        }
      }
    }
  `;

  const variables = { page, perPage: 50, type };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }  // ⬅ cache for 60s
  });

  const json = await response.json();
  return json.data.Page.media as Media[];
}

//Only for anime, since manga doesn't have seasons
export async function fetchUpcomingAnime(page: number): Promise<Media[]> {
  const { season, year } = getNextSeason();

  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          season: $season
          seasonYear: $seasonYear
          status: NOT_YET_RELEASED
          sort: TRENDING_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            color
          }
          season
          seasonYear
          episodes
          genres
        }
      }
    }
  `;

  const variables = { page, perPage: 50, season, seasonYear: year };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }  // ⬅ cache for 60s
  });

  const json = await response.json();

  // Safety checks
  if (!json.data?.Page?.media) return [];

  return json.data.Page.media as Media[];
}

export async function fetchAllTimePopularMedia(page: number, type: MediaType): Promise<Media[]> {
  const { season, year } = getNextSeason();

  const query = `
    query ($page: Int, $perPage: Int, $type: MediaType) {
  Page(page: $page, perPage: $perPage) {
    media(sort: POPULARITY_DESC, type: $type) {
      id
      title {
        english
        romaji
      }
      coverImage {
        large
        color
      }
      seasonYear
      episodes
      genres
    }
  }
}

  `;

  const variables = { page, perPage: 50,type, season, seasonYear: year };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }  // ⬅ cache for 60s
  });

  const json = await response.json();

  // Safety checks
  if (!json.data?.Page?.media) return [];

  return json.data.Page.media as Media[];
}

export async function fetchMediaByIds(ids: number[], type: MediaType ) {
  if (ids.length === 0) return [];

  const query = `
    query ($ids: [Int], $type: MediaType) {
      Page(perPage: 50) {
        media(id_in: $ids, type: $type) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
             color
          }
          genres
        }
      }
    }
  `;

  const chunkSize = 50;
  const chunks: number[][] = [];

  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }

  const pages = await Promise.all(
    chunks.map(async (chunk) => {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { ids: chunk, type },
        }),
        next: { revalidate: 60 },
      });

      const json = await res.json();
      return (json?.data?.Page?.media ?? []) as Media[];
    })
  );

  const merged = pages.flat();
  const byId = new Map<number, Media>();
  for (const media of merged) {
    byId.set(media.id, media);
  }

  return ids.map((id) => byId.get(id)).filter((item): item is Media => Boolean(item));
}


export async function fetchMediaById(id: number, type: MediaType): Promise<MediaDetails | null> {
const query = `
  query ($id: Int, $type: MediaType) {
    Media(id: $id, type: $type) {
      id
      idMal

      title {
        romaji
        english
        native
      }

    episodes
    chapters
    volumes

    format
    status
    genres


    synonyms

    duration
    season
    seasonYear
    source
    hashtag

    description(asHtml: false)

      coverImage {
        extraLarge
        large
        medium
        color
      }

      bannerImage

      averageScore
      meanScore
      popularity
      favourites
      trending

      rankings {
        rank
        type
        season
        year
        format
      }

      nextAiringEpisode {
        episode
        timeUntilAiring
      }

      startDate {
        year
        month
        day
      }

      endDate {
        year
        month
        day
      }

      studios(isMain: true) {
        nodes {
          id
          name
        }
      }

      
    producers: studios(isMain: false) {
      nodes {
        id
        name
      }
    }

      tags {
        name
        rank
        isGeneralSpoiler
      }

      trailer {
        id
        site
        thumbnail
      }

      relations {
        edges {
          relationType
          node {
            id
            status
            type
            title {
              romaji
            }
            format
            coverImage {
              large
            }
          }
        }
      }

      characters(perPage: 20) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
        }
      }

      staff(perPage: 20) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
        }
      }

      streamingEpisodes {
        title
        url
        site
        thumbnail
      }

      externalLinks {
        site
        url
        icon
      }

      siteUrl
    }   
  }
`;


  const variables = { id, type };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }  
  });

  const json = await response.json();
  if (!json.data?.Media) return null;

  
  return json.data.Media as MediaDetails ?? null;
}

export async function getAnimePage(page: number,{ genre, season, year, format, status }: { genre?: string; season?: string; year?: string; format?: string; status?: string; }) {
  const query = `
 query (
  $page: Int
  $perPage: Int
  $genre: [String]
  $season: MediaSeason
  $year: Int
  $format: MediaFormat
  $status: MediaStatus
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      lastPage
    }
    media(
      type: ANIME
      genre_in: $genre
      season: $season
      seasonYear: $year
      format: $format
      status: $status
      sort: TRENDING_DESC
    ) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        color
      }
      season
      seasonYear
      episodes
      genres
    }
  }
}
  `;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
  page,
  perPage: 45,
  genre: genre ? genre.split(",") : undefined,
  season,
  year: year ? Number(year) : undefined,
  format,
  status,
}
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  const safePage = json?.data?.Page;

  if (!safePage) {
    return {
      pageInfo: {
        currentPage: page,
        hasNextPage: false,
        lastPage: page,
      },
      media: [] as Media[],
    };
  }

  return safePage;
}

export async function getMangaPage(page: number) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
          lastPage
        }
        media(
          type: MANGA
          sort: TRENDING_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            color
          }
          season
          seasonYear
          chapters
          volumes
          genres
        }
      }
    }
  `;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { page, perPage: 45 },
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  const safePage = json?.data?.Page;

  if (!safePage) {
    return {
      pageInfo: {
        currentPage: page,
        hasNextPage: false,
        lastPage: page,
      },
      media: [] as Media[],
    };
  }

  return safePage;
}