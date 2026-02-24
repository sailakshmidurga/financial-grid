// import { useState, useRef, useEffect } from "react";
// import DebugPanel from "./DebugPanel";

// const ROW_HEIGHT = 45;
// const BUFFER = 10;

// export default function VirtualizedGrid({
//   data,
//   onSort,
//   sortConfig,
//   onCellUpdate
// }) {
//   const containerRef = useRef(null);

//   const [scrollTop, setScrollTop] = useState(0);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [editingCell, setEditingCell] = useState(null);
//   const [editValue, setEditValue] = useState("");

//   const [viewportHeight, setViewportHeight] = useState(
//     window.innerHeight - 200
//   );

//   useEffect(() => {
//     const handleResize = () =>
//       setViewportHeight(window.innerHeight - 200);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = 0;
//       setScrollTop(0);
//       setActiveIndex(null);
//     }
//   }, [data]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!data.length) return;

//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         setActiveIndex((prev) =>
//           prev === null ? 0 : Math.min(prev + 1, data.length - 1)
//         );
//       }

//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         setActiveIndex((prev) =>
//           prev === null ? 0 : Math.max(prev - 1, 0)
//         );
//       }

//       if (e.key === "Enter" && activeIndex !== null) {
//         const row = data[activeIndex];
//         setEditingCell({ rowId: row.id, key: "merchant" });
//         setEditValue(row.merchant);
//       }

//       if (e.key === "Escape") {
//         setEditingCell(null);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [activeIndex, data]);

//   useEffect(() => {
//     if (activeIndex === null || !containerRef.current) return;

//     const scrollPosition = activeIndex * ROW_HEIGHT;

//     containerRef.current.scrollTo({
//       top: scrollPosition,
//       behavior: "smooth"
//     });
//   }, [activeIndex]);

//   const totalHeight = data.length * ROW_HEIGHT;

//   const startIndex = Math.max(
//     0,
//     Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
//   );

//   const visibleCount =
//     Math.ceil(viewportHeight / ROW_HEIGHT) + BUFFER * 2;

//   const endIndex = Math.min(data.length, startIndex + visibleCount);

//   const visibleRows = data.slice(startIndex, endIndex);

//   const handleScroll = (e) => {
//     requestAnimationFrame(() => {
//       setScrollTop(e.target.scrollTop);
//     });
//   };

//   const handleRowClick = (index, event) => {
//     setActiveIndex(index);

//     if (event.ctrlKey || event.metaKey) {
//       setSelectedRows((prev) =>
//         prev.includes(index)
//           ? prev.filter((i) => i !== index)
//           : [...prev, index]
//       );
//     } else {
//       setSelectedRows([index]);
//     }
//   };

//   const columnTemplate = "120px 2fr 200px 150px";

//   return (
//     <>
//       <div
//         style={{
//           width: "100%",
//           padding: 20,
//           boxSizing: "border-box"
//         }}
//       >

//         {/* HEADER */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: columnTemplate,
//             columnGap: "20px",
//             width: "100%",
//             boxSizing: "border-box",
//             fontWeight: "bold",
//             borderBottom: "2px solid black",
//             padding: "12px 10px",
//             background: "#f0f0f0"
//           }}
//         >
//           <div
//             data-test-id="header-id"
//             onClick={() => onSort("id")}
//             style={{ cursor: "pointer" }}
//           >
//             ID
//           </div>

//           <div
//             data-test-id="header-merchant"
//             onClick={() => onSort("merchant")}
//             style={{ cursor: "pointer" }}
//           >
//             Merchant
//           </div>

//           <div
//             data-test-id="header-amount"
//             onClick={() => onSort("amount")}
//             style={{ cursor: "pointer", textAlign: "right" }}
//           >
//             Amount
//           </div>

//           <div
//             data-test-id="header-status"
//             onClick={() => onSort("status")}
//             style={{ cursor: "pointer" }}
//           >
//             Status
//           </div>
//         </div>

//         {/* SCROLL CONTAINER */}
//         <div
//           data-test-id="grid-scroll-container"
//           ref={containerRef}
//           onScroll={handleScroll}
//           style={{
//             height: viewportHeight,
//             overflowY: "auto",
//             overflowX: "hidden",
//             position: "relative",
//             border: "1px solid #ccc",
//             width: "100%",
//             boxSizing: "border-box",
//             background: "white"
//           }}
//         >
//           <div style={{ height: totalHeight }} />

//           <div
//             data-test-id="grid-row-window"
//             style={{
//               position: "absolute",
//               top: 0,
//               width: "100%",
//               boxSizing: "border-box",
//               transform: `translateY(${startIndex * ROW_HEIGHT}px)`
//             }}
//           >
//             {visibleRows.map((row, i) => {
//               const actualIndex = startIndex + i;
//               const isSelected = selectedRows.includes(actualIndex);
//               const isActive = activeIndex === actualIndex;

//               const isEditing =
//                 editingCell &&
//                 editingCell.rowId === row.id &&
//                 editingCell.key === "merchant";

//               return (
//                 <div
//                   key={row.id}
//                   data-test-id={`virtual-row-${actualIndex}`}
//                   data-selected={isSelected ? "true" : undefined}
//                   onClick={(e) => handleRowClick(actualIndex, e)}
//                   style={{
//                     height: ROW_HEIGHT,
//                     display: "grid",
//                     gridTemplateColumns: columnTemplate,
//                     columnGap: "20px",
//                     alignItems: "center",
//                     borderBottom: "1px solid #eee",
//                     padding: "0 10px",
//                     boxSizing: "border-box",
//                     background: isActive
//                       ? "#99ccff"
//                       : isSelected
//                       ? "#cce5ff"
//                       : actualIndex % 2 === 0
//                       ? "#fafafa"
//                       : "white",
//                     whiteSpace: "nowrap"
//                   }}
//                 >
//                   <div>{row.id}</div>

//                   <div
//                     data-test-id={`cell-${actualIndex}-merchant`}
//                     onDoubleClick={() => {
//                       setEditingCell({ rowId: row.id, key: "merchant" });
//                       setEditValue(row.merchant);
//                     }}
//                   >
//                     {isEditing ? (
//                       <input
//                         autoFocus
//                         value={editValue}
//                         onChange={(e) => setEditValue(e.target.value)}
//                         onBlur={() => {
//                           onCellUpdate(row.id, "merchant", editValue);
//                           setEditingCell(null);
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             onCellUpdate(row.id, "merchant", editValue);
//                             setEditingCell(null);
//                           }
//                           if (e.key === "Escape") {
//                             setEditingCell(null);
//                           }
//                         }}
//                       />
//                     ) : (
//                       row.merchant
//                     )}
//                   </div>

//                   <div style={{ textAlign: "right" }}>
//                     ₹ {row.amount.toFixed(2)}
//                   </div>

//                   <div>{row.status}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <DebugPanel
//         renderedRows={visibleRows.length}
//         scrollIndex={startIndex}
//         total={data.length}
//       />
//     </>
//   );
// }

import { useState, useRef, useEffect } from "react";
import DebugPanel from "./DebugPanel";

const ROW_HEIGHT = 45;
const BUFFER = 10;

export default function VirtualizedGrid({
  data,
  onSort,
  sortConfig,
  onCellUpdate
}) {
  const containerRef = useRef(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [viewportHeight, setViewportHeight] = useState(
    window.innerHeight - 200
  );

  useEffect(() => {
    const handleResize = () =>
      setViewportHeight(window.innerHeight - 200);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
      setActiveIndex(null);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!data.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, data.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev === null ? 0 : Math.max(prev - 1, 0)
        );
      }

      if (e.key === "Enter" && activeIndex !== null) {
        const row = data[activeIndex];
        setEditingCell({ rowId: row.id, key: "merchant" });
        setEditValue(row.merchant);
      }

      if (e.key === "Escape") {
        setEditingCell(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, data]);

  useEffect(() => {
    if (activeIndex === null || !containerRef.current) return;

    const scrollPosition = activeIndex * ROW_HEIGHT;

    containerRef.current.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
  }, [activeIndex]);

  const totalHeight = data.length * ROW_HEIGHT;

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
  );

  const visibleCount =
    Math.ceil(viewportHeight / ROW_HEIGHT) + BUFFER * 2;

  const endIndex = Math.min(data.length, startIndex + visibleCount);

  const visibleRows = data.slice(startIndex, endIndex);

  const handleScroll = (e) => {
    requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });
  };

  const handleRowClick = (index, event) => {
    setActiveIndex(index);

    if (event.ctrlKey || event.metaKey) {
      setSelectedRows((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedRows([index]);
    }
  };

  const renderSortArrow = (key) => {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const columnTemplate = "120px 2fr 200px 150px";

  return (
    <>
      <div style={{ width: "100%", padding: 20, boxSizing: "border-box" }}>

        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: columnTemplate,
            columnGap: "20px",
            width: "100%",
            fontWeight: "bold",
            borderBottom: "2px solid black",
            padding: "12px 10px",
            background: "#f0f0f0"
          }}
        >
          <div
            data-test-id="header-id"
            style={{ cursor: "pointer" }}
            onClick={() => onSort("id")}
          >
            ID {renderSortArrow("id")}
          </div>

          <div
            data-test-id="header-merchant"
            style={{ cursor: "pointer" }}
            onClick={() => onSort("merchant")}
          >
            Merchant {renderSortArrow("merchant")}
          </div>

          <div
            data-test-id="header-amount"
            style={{ cursor: "pointer", textAlign: "right" }}
            onClick={() => onSort("amount")}
          >
            Amount {renderSortArrow("amount")}
          </div>

          <div
            data-test-id="header-status"
            style={{ cursor: "pointer" }}
            onClick={() => onSort("status")}
          >
            Status {renderSortArrow("status")}
          </div>
        </div>

        {/* SCROLL CONTAINER */}
        <div
          data-test-id="grid-scroll-container"
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            height: viewportHeight,
            overflowY: "auto",
            position: "relative",
            border: "1px solid #ccc",
            width: "100%",
            background: "white"
          }}
        >
          <div style={{ height: totalHeight }} />

          <div
            data-test-id="grid-row-window"
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              transform: `translateY(${startIndex * ROW_HEIGHT}px)`
            }}
          >
            {visibleRows.map((row, i) => {
              const actualIndex = startIndex + i;
              const isSelected = selectedRows.includes(actualIndex);
              const isActive = activeIndex === actualIndex;

              const isEditing =
                editingCell &&
                editingCell.rowId === row.id &&
                editingCell.key === "merchant";

              return (
                <div
                  key={row.id}
                  data-test-id={`virtual-row-${actualIndex}`}
                  data-selected={isSelected ? "true" : undefined}
                  onClick={(e) => handleRowClick(actualIndex, e)}
                  style={{
                    height: ROW_HEIGHT,
                    display: "grid",
                    gridTemplateColumns: columnTemplate,
                    columnGap: "20px",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    padding: "0 10px",
                    background: isActive
                      ? "#99ccff"
                      : isSelected
                      ? "#cce5ff"
                      : actualIndex % 2 === 0
                      ? "#fafafa"
                      : "white",
                    whiteSpace: "nowrap"
                  }}
                >
                  <div>{row.id}</div>

                  {/* Editable Merchant */}
                  <div
                    data-test-id={`cell-${actualIndex}-merchant`}
                    onDoubleClick={() => {
                      setEditingCell({ rowId: row.id, key: "merchant" });
                      setEditValue(row.merchant);
                    }}
                    title="Double click to edit"
                    style={{ cursor: "pointer" }}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => {
                          onCellUpdate(row.id, "merchant", editValue);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onCellUpdate(row.id, "merchant", editValue);
                            setEditingCell(null);
                          }
                          if (e.key === "Escape") {
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : (
                      <>
                        {row.merchant}{" "}
                        <span style={{ opacity: 0.4 }}>✏️</span>
                      </>
                    )}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    ₹ {row.amount.toFixed(2)}
                  </div>

                  <div>{row.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DebugPanel
        renderedRows={visibleRows.length}
        scrollIndex={startIndex}
        total={data.length}
      />
    </>
  );
}