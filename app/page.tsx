export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      textAlign: "center"
    }}>
      <h1>✅ BFHL API is running!</h1>
      <p>👉 Use <code>POST /api/bfhl</code> to test.</p>
      <p>Example: send JSON <code>{"{\"data\":[\"a\",\"1\",\"334\",\"4\",\"R\",\"$\"]}"}</code></p>
    </div>
  )
}
