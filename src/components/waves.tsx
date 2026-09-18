export function WaveDivider({
  fill = "#eef9fd",
  top = "#16a7ad",
  flip = false,
  flat = false,
}: {
  fill?: string;
  top?: string;
  flip?: boolean;
  flat?: boolean;
}) {
  return (
    <div className={`wave-divider${flip ? " flip" : ""}${flat ? " flat" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
        <path
          className="wave-far"
          d="M0,68 C160,96 320,38 480,46 C640,54 800,92 960,84 C1120,76 1280,42 1440,54 L1440,110 L0,110 Z"
          fill={top}
          opacity="0.35"
        />
        <path
          className="wave-near"
          d="M0,86 C180,102 380,64 580,72 C780,80 980,106 1180,96 C1320,89 1400,96 1440,100 L1440,110 L0,110 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function WaveLines() {
  return <div className="swell-ring" aria-hidden="true" />;
}