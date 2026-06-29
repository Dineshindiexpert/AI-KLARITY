import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { TrendingUp, Calendar } from "lucide-react";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PolarGrid,PolarAngleAxis,PolarRadiusAxis,Radar,} from "recharts";
import { getDashboardAnalytics } from "../../api/interviewApi";

 

const skillsProgress = [
  { label: "Communication Progress", percentage: 85, color: "#10B981" },
  { label: "Technical Progress", percentage: 78, color: "#7C3AED" },
  { label: "Confidence Progress", percentage: 82, color: "#3B82F6" },
  { label: "Core Role Alignment", percentage: 73, color: "#F59E0B" },
];

 

const s = {
  page: {
    backgroundColor: "#0B0F19",
    minHeight: "100%",
    color: "#fff",
  },
  card: {
    backgroundColor: "#161F30",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 21,
  },
  pillActive: {
    backgroundColor: "#7C3AED",
    color: "#fff",
    borderRadius: 999,
    border: "none",
    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  pillInactive: {
    backgroundColor: "#0B0F19",
    color: "#9CA3AF",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  iconBox: {
    width: 48,
    height: 48,
    background: "linear-gradient(135deg,#7C3AED,#10B981)",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
    flexShrink: 0,
  },
  scoreCard: {
    background:
      "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(16,185,129,0.1))",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: 21,
    padding: "1.25rem",
  },
  summaryCard: {
    background:
      "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(16,185,129,0.2))",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: 21,
    padding: "1.5rem",
  },
   
};

const GrowthAnalytic = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const periods = ["Last 7 Days","Last 30 Days","Last 6 Months","Custom Range",];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardAnalytics();
        console.log("API DATA:", res);
        setDashboard(res);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const chartData = dashboard?.chartData || [];

  const scaledChartData =
  chartData?.map((item) => ({
    ...item,
    score: item.score * 10,
    previous: item.previous ? item.previous * 10 : undefined,
  })) || [];
  

  return (
    <div style={s.page}>
      <div className="container-fluid px-4 px-lg-5 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 style={{ color: "#fff", fontSize: "1.875rem", fontWeight: 600 }}>
            Advanced Performance Insights
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }} className="mb-0">
            Deep-dive analysis and multi-period historical comparison of your
            interview growth
          </p>
        </div>

       

        {/* Line Chart Section */}
        <div className="p-4 p-lg-5 mb-4" style={s.card}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <div style={s.iconBox}>
                <TrendingUp size={24} color="#fff" />
              </div>
              <div>
                <h2
                  style={{
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                  }}
                  className="mb-0"
                >
                  Multi-Period Performance Comparison
                </h2>
                <p
                  style={{ color: "#9CA3AF", fontSize: "0.875rem" }}
                  className="mb-0"
                >
                  Current period vs historical baseline
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 16,
                    height: 4,
                    background: "linear-gradient(90deg,#7C3AED,#10B981)",
                    borderRadius: 999,
                  }}
                />
                <span style={{ color: "#E5E7EB", fontSize: "0.875rem" }}>
                  Current Period
                </span>
              </div>
              {compareEnabled && (
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 16,
                      height: 4,
                      backgroundColor: "#6B7280",
                      borderRadius: 999,
                    }}
                  />
                  <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                    Previous Period
                  </span>
                </div>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={scaledChartData}>
              <defs>
                <linearGradient
                  id="currentGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="glowEffect">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fill: "#9CA3AF", fontSize: 14 }}
                tickLine={false}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: "#9CA3AF", fontSize: 14 }}
                domain={[0, 100]}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F19",
                  border: "1px solid rgba(124,58,237,0.4)",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "#9CA3AF", marginBottom: 8, fontSize: 13 }}
                itemStyle={{ color: "#fff", fontSize: 14, fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#currentGradient)"
                strokeWidth={5}
                dot={{
                  fill: "#7C3AED",
                  r: 10,
                  strokeWidth: 4,
                  stroke: "#0B0F19",
                }}
                activeDot={{
                  r: 12,
                  fill: "#10B981",
                  strokeWidth: 4,
                  stroke: "#0B0F19",
                }}
                filter="url(#glowEffect)"
              />
              {compareEnabled && (
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#6B7280"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{
                    fill: "#6B7280",
                    r: 6,
                    strokeWidth: 2,
                    stroke: "#0B0F19",
                  }}
                  opacity={0.5}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          <div className="row g-3 mt-2">
            {chartData.map((item, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={s.scoreCard }>
                  <div
                    style={{ color: "#9CA3AF", fontSize: "0.875rem" }}
                    className="mb-1"
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                    }}
                    className="mb-1"
                  >
                    {item.score *10}%
                  </div>
                   
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="row g-4">
          {/* Core Skill Metrics */}
          <div className="col-12 col-lg-6">
            <div className="p-4 p-lg-5 h-100 d-flex flex-column" style={s.card}>
              <h2
                style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 600 }}
                className="mb-4"
              >
                Core Skill Metrics
              </h2>
              <div className="d-flex flex-column gap-4">
                {skillsProgress.map((skill) => (
                  <div key={skill.label}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        style={{
                          color: "#E5E7EB",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {skill.label}
                      </span>
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                        }}
                      >
                        {skill.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 16,
                        backgroundColor: "rgba(11,15,25,0.5)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${skill.percentage}%`,
                          background: `linear-gradient(90deg,${skill.color},${skill.color}cc)`,
                          boxShadow: `0 0 12px ${skill.color}88`,
                          borderRadius: 999,
                          transition: "width 0.7s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 pt-4 mt-auto"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div style={s.summaryCard}>
                  <div
                    style={{ color: "#9CA3AF", fontSize: "0.875rem" }}
                    className="mb-2"
                  >
                    Overall Progress Score
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "2.25rem",
                      fontWeight: 700,
                    }}
                    className="mb-2"
                  >
                    {dashboard?.improvement ?? 0}%
                  </div>
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{
                      color: "#10B981",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>imporvement since first interview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          
        </div>
      </div>
    </div>
  );
};

export default GrowthAnalytic;
