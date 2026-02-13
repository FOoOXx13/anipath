export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
  };
  episodes: number | null;
  season: string | null;
  seasonYear: number | null;
  genres?: string[];
}
export interface AnimeDetails {
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
  bannerImage?: string;
  description?: string;
  averageScore?: number;
  popularity?: number;
  episodes?: number;
  season?: string;
  seasonYear?: number;
  format?: string;
  duration?: number;
  status?: string;
  source?: string;
  hashtag?: string;
  genres?: string[];
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
}

const ANILIST_URL = "https://graphql.anilist.co";

export async function searchAnime(query: string) {
  const gql = `
    query ($search: String) {
      Page(perPage: 20) {
        media(
          search: $search
          type: ANIME
          sort: [POPULARITY_DESC]
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
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
      variables: { search: query },
    }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  return json.data.Page.media;
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

export async function fetchTrendingAnime(page: number): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          sort: TRENDING_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          episodes
          season
          seasonYear
          genres
        }
      }
    }
  `;

  const variables = { page, perPage: 50 };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }  // ⬅ cache for 60s
  });

  const json = await response.json();
  return json.data.Page.media as Anime[];
}

export async function fetchUpcomingAnime(page: number): Promise<Anime[]> {
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

  return json.data.Page.media as Anime[];
}

export async function fetchAllTimePopularAnime(page: number): Promise<Anime[]> {
  const { season, year } = getNextSeason();

  const query = `
    query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(sort: POPULARITY_DESC, type: ANIME) {
      id
      title {
        english
        romaji
      }
      coverImage {
        large
      }
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

  return json.data.Page.media as Anime[];
}

export async function fetchAnimeByIds(ids: number[]) {
  if (ids.length === 0) return [];

  const query = `
    query ($ids: [Int]) {
      Page(perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
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
      variables: { ids },
    }),
    next: { revalidate: 60 }, 
  });

  const json = await res.json();
  return json.data.Page.media;
}


export async function fetchAnimeById(id: number): Promise<AnimeDetails | null> {
const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal

      title {
        romaji
        english
        native
      }

    synonyms

    format
    status
    episodes
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

      genres
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


  const variables = { id };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }  // ⬅ cache for 60s
  });

  const json = await response.json();
  if (!json.data?.Media) return null;

  
  return json.data.Media as AnimeDetails;
}

