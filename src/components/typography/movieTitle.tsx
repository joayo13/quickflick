export default function MovieTitle({ title }: { title?: string }) {
    return <h1 className="text-4xl font-bold tracking-tight">{title ? title : "Unknown Title"}</h1>;
}
