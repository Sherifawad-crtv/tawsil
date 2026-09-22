import PhoneIphoneOutlined from "@mui/icons-material/PhoneIphoneOutlined";

export default function MobileOnlyGate() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center"
      style={{ backgroundColor: "#040033" }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(18,83,250,0.15)" }}
      >
        <PhoneIphoneOutlined sx={{ fontSize: 30, color: "#1253FA" }} />
      </div>
      <h1
        style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "22px",
          color: "white",
          lineHeight: 1.3,
        }}
      >
        Mobile Only Experience
      </h1>
      <p
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: "13px",
          color: "#9CA3AF",
          lineHeight: 1.6,
          maxWidth: "320px",
        }}
      >
        Tawsil is built for mobile. Please open this page on your phone to continue.
      </p>
    </div>
  );
}
