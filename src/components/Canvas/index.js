import React, { useRef, useEffect } from "react";
import { Application } from "pixi.js";
import initPixi from "./initPixi";

export default function Canvas() {
    const ref = useRef(null);

    useEffect(() => {
        const app = new Application({
            resizeTo: window,
            backgroundColor: 0xeef1f5,
        })
        // On first render init application
        const destroy = initPixi(app)

        // Add app to DOM
        ref.current.appendChild(app.view);

        return destroy;
    }, []);

    return <div data-testid="canvas" ref={ref} />;
}