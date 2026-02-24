import { useEffect, useState } from "react";

export default function DebugPanel({ renderedRows, scrollIndex, total }) {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frame = 0;

    function loop() {
      frame++;
      const now = performance.now();

      if (now > lastTime + 1000) {
        setFps(frame);
        frame = 0;
        lastTime = now;
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }, []);

  return (
    <div
      data-test-id="debug-panel"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "black",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "14px",
        zIndex: 1000
      }}
    >
      <div data-test-id="debug-fps">FPS: {fps}</div>
      <div data-test-id="debug-rendered-rows">
        Rendered Rows: {renderedRows}
      </div>
      <div data-test-id="debug-scroll-position">
        Row {scrollIndex} / {total}
      </div>
    </div>
  );
}