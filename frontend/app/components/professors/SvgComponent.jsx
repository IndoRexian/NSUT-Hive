import * as React from "react";
const SvgComponent = ({ percent = 70, size = 64 }) => (
    //console.log(props),
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="hover:scale-[1.25] active:scale-[1.25] width 200ms ease-out
            transition-all"
    >
        {/* 1️⃣ Define the star mask */}
        <defs>
            <mask id="star-mask">
                {/* White = visible */}
                <path
                    d="M12 18.5l-4.67 2.46a1 1 0 0 1-1.45-1.06l.89-5.2-3.78-3.69a1 1 0 0 1 .55-1.71l5.22-.76 2.34-4.73a1 1 0 0 1 1.79 0l2.34 4.73 5.22.76a1 1 0 0 1 .55 1.71l-3.78 3.69.89 5.2a1 1 0 0 1-1.45 1.06z"
                    fill="white"
                />
            </mask>
        </defs>

        {/* 2️⃣ Base star (empty / gray) */}
        <path
            d="M12 18.5l-4.67 2.46a1 1 0 0 1-1.45-1.06l.89-5.2-3.78-3.69a1 1 0 0 1 .55-1.71l5.22-.76 2.34-4.73a1 1 0 0 1 1.79 0l2.34 4.73 5.22.76a1 1 0 0 1 .55 1.71l-3.78 3.69.89 5.2a1 1 0 0 1-1.45 1.06z"
            fill="#555"
        />

        {/* 3️⃣ Filled part (yellow rectangle clipped by mask) */}
        <rect
            x="0"
            y="0"
            width={`${percent}%`}
            height="100%"
            fill="#FFD700"
            mask="url(#star-mask)"
        />
    </svg>
);
export default SvgComponent;
