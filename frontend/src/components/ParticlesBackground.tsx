"use client";

import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim"; // Use slim version
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";

export default function ParticlesBackground() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine); // Load slim instead of full
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: true, zIndex: 0 },
                particles: {
                    number: {
                        value: 80,
                        density: { enable: true, area: 800 },
                    },
                    color: {
                        value: ["#4ade80", "#60a5fa", "#f87171"], // Multiple colors for variety
                    },
                    shape: {
                        type: ["circle", "triangle"], // Mix of shapes representing knowledge/thoughts
                        options: {
                            polygon: { nb_sides: 6 }, // Hexagons for some particles
                        },
                    },
                    opacity: {
                        value: { min: 0.1, max: 0.5 },
                        animation: {
                            enable: true,
                            speed: 1,
                            sync: false,
                        },
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                    links: {
                        enable: true,
                        distance: 150,
                        color: "#88888833",
                        opacity: 0.4,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: true,
                        outModes: { default: "bounce" },
                    },
                },
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                    },
                    modes: {
                        grab: { distance: 140, links: { opacity: 0.8 } },
                    },
                },
                background: { color: "transparent" },
            }}
        />
    );
}
