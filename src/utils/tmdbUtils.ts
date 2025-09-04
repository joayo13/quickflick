export const genresList = [
    { id: "28", label: "Action" },
    { id: "12", label: "Adventure" },
    { id: "16", label: "Animation" },
    { id: "35", label: "Comedy" },
    { id: "80", label: "Crime" },
    { id: "99", label: "Documentary" },
    { id: "18", label: "Drama" },
    { id: "10751", label: "Family" },
    { id: "14", label: "Fantasy" },
    { id: "36", label: "History" },
    { id: "27", label: "Horror" },
    { id: "10402", label: "Music" },
    { id: "9648", label: "Mystery" },
    { id: "10749", label: "Romance" },
    { id: "878", label: "Science Fiction" },
    { id: "10770", label: "TV Movie" },
    { id: "53", label: "Thriller" },
    { id: "10752", label: "War" },
    { id: "37", label: "Western" },
];

export const watchProvidersList = [
    { id: "8", label: "Netflix" },
    { id: "119", label: "Prime Video" },
    { id: "337", label: "Disney+" },
    { id: "230", label: "Crave" },
    { id: "531", label: "Paramount Plus" },
    { id: "314", label: "CBC Gem" },
    { id: "350", label: "Apple TV+" },
    { id: "15", label: "Hulu" },
    { id: "99", label: "Shudder" },
];

export function getGenreLabel(id: string | number) {
    const genre = genresList.find((genre) => genre.id === id.toString());
    return genre?.label ?? "Unknown Genre";
}
