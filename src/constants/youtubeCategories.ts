export interface YouTubeCategory {
    id: string;
    title: string;
    assignable: boolean;
}

const rawCategories = [
    { id: "1", title: "Film & Animation", assignable: true },
    { id: "2", title: "Autos & Vehicles", assignable: true },
    { id: "10", title: "Music", assignable: true },
    { id: "15", title: "Pets & Animals", assignable: true },
    { id: "17", title: "Sports", assignable: true },
    { id: "18", title: "Short Movies", assignable: false },
    { id: "19", title: "Travel & Events", assignable: true },
    { id: "20", title: "Gaming", assignable: true },
    { id: "21", title: "Videoblogging", assignable: false },
    { id: "22", title: "People & Blogs", assignable: true },
    { id: "23", title: "Comedy", assignable: true },
    { id: "24", title: "Entertainment", assignable: true },
    { id: "25", title: "News & Politics", assignable: true },
    { id: "26", title: "Howto & Style", assignable: true },
    { id: "27", title: "Education", assignable: true },
    { id: "28", title: "Science & Technology", assignable: true },
    { id: "29", title: "Nonprofits & Activism", assignable: true },
    { id: "30", title: "Movies", assignable: false },
    { id: "31", title: "Anime/Animation", assignable: false },
    { id: "32", title: "Action/Adventure", assignable: false },
    { id: "33", title: "Classics", assignable: false },
    { id: "34", title: "Comedy", assignable: false },
    { id: "35", title: "Documentary", assignable: false },
    { id: "36", title: "Drama", assignable: false },
    { id: "37", title: "Family", assignable: false },
    { id: "38", title: "Foreign", assignable: false },
    { id: "39", title: "Horror", assignable: false },
    { id: "40", title: "Sci-Fi/Fantasy", assignable: false },
    { id: "41", title: "Thriller", assignable: false },
    { id: "42", title: "Shorts", assignable: false },
    { id: "43", title: "Shows", assignable: false },
    { id: "44", title: "Trailers", assignable: false }
];

export const YOUTUBE_CATEGORIES: YouTubeCategory[] = rawCategories.filter(
    (category) => category.assignable
);

export const VALID_YOUTUBE_CATEGORY_IDS = new Set(
    YOUTUBE_CATEGORIES.map(c => c.id)
);
