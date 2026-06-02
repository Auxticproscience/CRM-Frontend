const POWERBI_URL =
  "https://app.powerbi.com/reportEmbed?reportId=4aca6a04-237f-44d8-af63-e2c4624bffbc&autoAuth=true&ctid=d16ee8c2-074c-45cd-9bfe-18478c2d72c9"

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