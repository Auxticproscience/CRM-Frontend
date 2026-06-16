const POWERBI_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiYjAxYjY3MjEtYTE2ZS00ZDM2LThmNmMtZjlkMTA3MzJjNjFmIiwidCI6ImQxNmVlOGMyLTA3NGMtNDVjZC05YmZlLTE4NDc4YzJkNzJjOSJ9"

export default function DashboardView() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        title="Dashboard ProScience"
        src={POWERBI_URL}
        style={{ width: "100%", height: "100%", border: "none" }}
        allowFullScreen
      />
    </div>
  )
}