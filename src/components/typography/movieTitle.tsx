export default function MovieTitle({ text }: { text?: string }) {
    return <h1 className="text-4xl font-bold tracking-tight">{text ? text : "Unknown Title"}</h1>;
}
