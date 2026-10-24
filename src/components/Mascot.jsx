import "./Mascot.css";

function Mascot({ mood = "thinking" }) {
  return (
    <div className={`owl-container owl-${mood}`}>
      <div className="owl-shadow"></div>

      <svg
        className="owl-svg"
        viewBox="0 0 240 250"
        role="img"
        aria-label={`StepMate owl is ${mood}`}
      >
        <path
          d="M58 66 L40 15 Q68 25 91 43 L149 43 Q172 25 200 15 L182 66"
          fill="#9B6748"
          stroke="#70452F"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <ellipse
          cx="120"
          cy="130"
          rx="83"
          ry="96"
          fill="#B98058"
          stroke="#70452F"
          strokeWidth="4"
        />

        <ellipse cx="120" cy="151" rx="65" ry="67" fill="#FFF0D5" />

        <ellipse
          cx="87"
          cy="105"
          rx="35"
          ry="37"
          fill="#FFF9EF"
        />

        <ellipse
          cx="153"
          cy="105"
          rx="35"
          ry="37"
          fill="#FFF9EF"
        />

        <g className="owl-eyes">
          <circle cx="88" cy="106" r="20" fill="#FFFFFF" />
          <circle cx="152" cy="106" r="20" fill="#FFFFFF" />

          <circle cx="91" cy="108" r="11" fill="#382A25" />
          <circle cx="149" cy="108" r="11" fill="#382A25" />

          <circle cx="95" cy="103" r="4" fill="#FFFFFF" />
          <circle cx="153" cy="103" r="4" fill="#FFFFFF" />
        </g>

        <g className="owl-closed-eyes">
          <path
            d="M73 106 Q88 120 103 106"
            fill="none"
            stroke="#382A25"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M137 106 Q152 120 167 106"
            fill="none"
            stroke="#382A25"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <path
          d="M109 128 L131 128 L120 145 Z"
          fill="#F3AD45"
          stroke="#B77727"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <g className="owl-smile">
          <path
            d="M104 158 Q120 176 136 158"
            fill="none"
            stroke="#70452F"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <g className="owl-sad-mouth">
          <path
            d="M104 168 Q120 151 136 168"
            fill="none"
            stroke="#70452F"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <ellipse cx="71" cy="145" rx="12" ry="7" fill="#F3A38C" />
        <ellipse cx="169" cy="145" rx="12" ry="7" fill="#F3A38C" />

        <path
          d="M48 145 Q25 125 35 99 Q58 108 60 133"
          fill="#B98058"
          stroke="#70452F"
          strokeWidth="4"
        />

        <path
          d="M192 145 Q215 125 205 99 Q182 108 180 133"
          fill="#B98058"
          stroke="#70452F"
          strokeWidth="4"
        />

        <path
          d="M91 218 L85 237 L111 237 L115 218"
          fill="#F3AD45"
          stroke="#B77727"
          strokeWidth="3"
        />

        <path
          d="M125 218 L129 237 L155 237 L149 218"
          fill="#F3AD45"
          stroke="#B77727"
          strokeWidth="3"
        />

        <g className="owl-stars" fill="#F3AD45">
          <path d="M26 65 L31 77 L44 78 L34 87 L37 100 L26 93 L15 100 L18 87 L8 78 L21 77 Z" />
          <path d="M208 57 L212 66 L222 67 L214 74 L216 84 L208 79 L200 84 L202 74 L194 67 L204 66 Z" />
        </g>
      </svg>

      <div className="owl-name">StepMate</div>
      <div className="owl-status">
        {mood === "listening" && "I'm listening to you!"}
        {mood === "thinking" && "Let's think together!"}
        {mood === "happy" && "You're doing great!"}
        {mood === "celebrating" && "Amazing work!"}
        {mood === "sad" && "It's okay, let's try again!"}
      </div>
    </div>
  );
}

export default Mascot;