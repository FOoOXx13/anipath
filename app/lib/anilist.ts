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
}

export interface AnimeDetails {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
  };
  description: string | null;
  episodes: number | null;
  season: string | null;
  seasonYear: number | null;
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
        }
      }
    }
  `;

  const variables = { page, perPage: 50 };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await response.json();
  return json.data.Page.media as Anime[];
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
        }
      }
    }
  `;

  const variables = { page, perPage: 50, season, seasonYear: year };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
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
    }
  }
}

  `;

  const variables = { page, perPage: 50, season, seasonYear: year };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await response.json();

  // Safety checks
  if (!json.data?.Page?.media) return [];

  return json.data.Page.media as Anime[];
}

export async function fetchAnimeById(id: number): Promise<AnimeDetails | null> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        description(asHtml: false)
        episodes
        season
        seasonYear
      }
    }
  `;

  const variables = { id };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await response.json();
  if (!json.data?.Media) return null;

  
  return json.data.Media as AnimeDetails;
}

