// import { useEffect, useState, useMemo } from "react";
// import VirtualizedGrid from "./components/VirtualizedGrid";

// function App() {
//   const [data, setData] = useState([]);
//   const [filterInput, setFilterInput] = useState("");
//   const [filter, setFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState(null);
//   const [sortConfig, setSortConfig] = useState(null);

//   useEffect(() => {
//     fetch("/transactions.json")
//       .then((res) => res.json())
//       .then((json) => {
//         setData(json);
//       });
//   }, []);

//   // Debounce merchant filter
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setFilter(filterInput);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [filterInput]);

//   // Apply merchant + status filtering
//   const filteredData = useMemo(() => {
//     return data.filter((row) => {
//       const merchantMatch = filter
//         ? row.merchant.toLowerCase().includes(filter.toLowerCase())
//         : true;

//       const statusMatch = statusFilter
//         ? row.status === statusFilter
//         : true;

//       return merchantMatch && statusMatch;
//     });
//   }, [data, filter, statusFilter]);

//   // Sorting
//   const sortedData = useMemo(() => {
//     if (!sortConfig) return filteredData;

//     const { key, direction } = sortConfig;

//     return [...filteredData].sort((a, b) => {
//       if (typeof a[key] === "number") {
//         return direction === "asc"
//           ? a[key] - b[key]
//           : b[key] - a[key];
//       }

//       return direction === "asc"
//         ? a[key].localeCompare(b[key])
//         : b[key].localeCompare(a[key]);
//     });
//   }, [filteredData, sortConfig]);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "asc"
//     ) {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleCellUpdate = (rowId, key, newValue) => {
//     setData((prev) =>
//       prev.map((row) =>
//         row.id === rowId ? { ...row, [key]: newValue } : row
//       )
//     );
//   };

//   return (
//     <div style={{ padding: 20 }}>

//       {/* Merchant Filter */}
//       <input
//         data-test-id="filter-merchant"
//         type="text"
//         placeholder="Filter by merchant..."
//         value={filterInput}
//         onChange={(e) => setFilterInput(e.target.value)}
//         style={{ padding: "8px", marginBottom: "10px", width: "300px" }}
//       />

//       {/* Quick Status Filters */}
//       <div style={{ marginBottom: "15px" }}>
//         <button
//           data-test-id="quick-filter-Completed"
//           onClick={() => setStatusFilter("Completed")}
//         >
//           Completed
//         </button>

//         <button
//           data-test-id="quick-filter-Pending"
//           onClick={() => setStatusFilter("Pending")}
//           style={{ marginLeft: "10px" }}
//         >
//           Pending
//         </button>

//         <button
//           data-test-id="quick-filter-Failed"
//           onClick={() => setStatusFilter("Failed")}
//           style={{ marginLeft: "10px" }}
//         >
//           Failed
//         </button>

//         <button
//           onClick={() => setStatusFilter(null)}
//           style={{ marginLeft: "10px" }}
//         >
//           Clear
//         </button>
//       </div>

//       {/* Result Count */}
//       <div
//         data-test-id="filter-count"
//         style={{ marginBottom: "10px", fontWeight: "bold" }}
//       >
//         Showing {sortedData.length.toLocaleString()} of {data.length.toLocaleString()} rows
//       </div>

//       <VirtualizedGrid
//         data={sortedData}
//         onSort={handleSort}
//         sortConfig={sortConfig}
//         onCellUpdate={handleCellUpdate}
//       />
//     </div>
//   );
// }

// export default App;

import { useEffect, useState, useMemo } from "react";
import VirtualizedGrid from "./components/VirtualizedGrid";

function App() {
  const [data, setData] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    fetch("/transactions.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter(filterInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [filterInput]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const merchantMatch = filter
        ? row.merchant.toLowerCase().includes(filter.toLowerCase())
        : true;

      const statusMatch = statusFilter
        ? row.status === statusFilter
        : true;

      return merchantMatch && statusMatch;
    });
  }, [data, filter, statusFilter]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;

    return [...filteredData].sort((a, b) => {
      if (typeof a[key] === "number") {
        return direction === "asc"
          ? a[key] - b[key]
          : b[key] - a[key];
      }

      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCellUpdate = (rowId, key, newValue) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [key]: newValue } : row
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>

      {/* Helper Text */}
      <div style={{ marginBottom: "10px", fontSize: "14px", color: "#555" }}>
        Click column headers to sort. Double-click merchant name to edit.
      </div>

      <input
        data-test-id="filter-merchant"
        type="text"
        placeholder="Filter by merchant..."
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "300px" }}
      />

      <div style={{ marginBottom: "15px" }}>
        <button data-test-id="quick-filter-Completed"
          onClick={() => setStatusFilter("Completed")}>
          Completed
        </button>

        <button data-test-id="quick-filter-Pending"
          onClick={() => setStatusFilter("Pending")}
          style={{ marginLeft: "10px" }}>
          Pending
        </button>

        <button data-test-id="quick-filter-Failed"
          onClick={() => setStatusFilter("Failed")}
          style={{ marginLeft: "10px" }}>
          Failed
        </button>

        <button onClick={() => setStatusFilter(null)}
          style={{ marginLeft: "10px" }}>
          Clear
        </button>
      </div>

      <div
        data-test-id="filter-count"
        style={{ marginBottom: "10px", fontWeight: "bold" }}
      >
        Showing {sortedData.length.toLocaleString()} of {data.length.toLocaleString()} rows
      </div>

      <VirtualizedGrid
        data={sortedData}
        onSort={handleSort}
        sortConfig={sortConfig}
        onCellUpdate={handleCellUpdate}
      />
    </div>
  );
}

export default App;