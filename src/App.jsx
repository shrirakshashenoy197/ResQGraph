import { useState } from "react";

const infrastructure = [
  {
    id: "power",
    name: "Power Substation",
    type: "Power",
    population: 0,
    service: "Electricity",
  },
  {
    id: "water",
    name: "Water Treatment Plant",
    type: "Water",
    population: 0,
    service: "Water Supply",
  },
  {
    id: "pump",
    name: "Pumping Station",
    type: "Water",
    population: 12000,
    service: "Water Distribution",
  },
  {
    id: "hospital",
    name: "Hospital",
    type: "Healthcare",
    population: 18000,
    service: "Emergency Healthcare",
  },
  {
    id: "residential",
    name: "Residential Zone",
    type: "Community",
    population: 45000,
    service: "Community",
  },
];

const dependencies = [
  ["power", "water"],
  ["power","hospital"],
  ["water", "pump"],
  ["pump", "hospital"],
  ["hospital", "residential"],
];

function App() {
  const [selectedAsset, setSelectedAsset] = useState("power");
  const [failedAsset, setFailedAsset] = useState(null);
  const [affectedAssets, setAffectedAssets] = useState([]);
  const [selectedFailures, setSelectedFailures] = useState([]);
  const [scenarioA, setScenarioA] = useState(null);
  const [scenarioB, setScenarioB] = useState(null);
  const [criticalAsset,setCriticalAsset]=useState(null);

  function calculateCascade(startAsset) {
  const affected = [];
  const queue = [startAsset];

  while (queue.length > 0) {
    const current = queue.shift();

    if (affected.includes(current)) {
      continue;
    }

    affected.push(current);

    const nextAssets = dependencies
      .filter(([from]) => from === current)
      .map(([, to]) => to);

    queue.push(...nextAssets);
  }

  return affected;
}

  function toggleFailureAsset(id) {
  setSelectedFailures((current) =>
    current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]
  );
}
function simulateFailure() {
  const startingAssets =
    selectedFailures.length > 0
      ? selectedFailures
      : [selectedAsset];

  const combinedAffected = [];

  startingAssets.forEach((startAsset) => {
    const cascade = calculateCascade(startAsset);

    cascade.forEach((asset) => {
      if (!combinedAffected.includes(asset)) {
        combinedAffected.push(asset);
      }
    });
  });

  setFailedAsset(startingAssets[0]);
  setAffectedAssets(combinedAffected);
  findCriticalAsset();
}

  function saveScenario() {
    const affected = calculateCascade(selectedAsset);

    const scenario = {
      asset: selectedAsset,
      affected: affected,
      population: infrastructure
        .filter((asset) => affected.includes(asset.id))
        .reduce((total, asset) => total + asset.population, 0),
      depth: affected.length - 1,
      criticality: Math.min(100, affected.length * 20),
    };

    if (!scenarioA) {
      setScenarioA(scenario);
    } else {
      setScenarioB(scenario);
    }
  }
  function findCriticalAsset() {
  let mostCritical = null;
  let highestImpact = -1;

  infrastructure.forEach((asset) => {
    const cascade = calculateCascade(asset.id);

    if (cascade.length > highestImpact) {
      highestImpact = cascade.length;
      mostCritical = asset.id;
    }
  });

  setCriticalAsset(mostCritical);
}


  function resetSimulation() {
    setFailedAsset(null);
    setAffectedAssets([]);
    setSelectedFailures([]);
  }

  const affectedNodes = infrastructure.filter((asset) =>
    affectedAssets.includes(asset.id)
  );

  const affectedPopulation = affectedNodes.reduce(
    (total, asset) => total + asset.population,
    0
  );

  const cascadeDepth = affectedAssets.length
    ? affectedAssets.length - 1
    : 0;

  const criticalityScore = affectedAssets.length
    ? Math.min(100, affectedAssets.length * 20)
    : 0;

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>ResQGraph</h1>
          <p>Cascading Infrastructure Impact Simulator</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Simulation Ready
        </div>
      </header>

      <main className="container">

        <section className="intro">
          <h2>Infrastructure Resilience Simulator</h2>

          <p>
            Explore how the failure of one critical asset can
            propagate through an interconnected infrastructure network.
          </p>
        </section>

        <section className="dashboard">

          <div className="graph-card">

            <div className="card-header">
              <div>
                <h3>Dependency Network</h3>
                <p>
  Select one or more assets, then inject a failure.
  Selected: {selectedFailures.length}
</p>
              </div>
            </div>
<div className="graph">
  <div className="network">
    <div className="network-row">
      <div className="node-wrapper">
        <button
          className={`node ${
            affectedAssets.includes("power") ? "affected" : ""
          } ${
            failedAsset==="power" ? "failed": ""
          } ${  
            selectedAsset === "power" ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAsset("power");
            toggleFailureAsset("power");
          }}
        >
          <strong>Power Substation</strong>
          <span>Power</span>
        </button>

        <div className="arrow">→</div>
      </div>

      <div className="node-wrapper">
        <button
          className={`node ${
            affectedAssets.includes("water") ? "affected" : ""
          } ${
            failedAsset==="water" ? "failed":""
          } ${
            selectedAsset === "water" ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAsset("water");
            toggleFailureAsset("water");
          }}
        >
          <strong>Water Treatment Plant</strong>
          <span>Water</span>
        </button>

        <div className="arrow">→</div>
      </div>

      <div className="node-wrapper">
        <button
          className={`node ${
            affectedAssets.includes("pump") ? "affected" : ""
          } ${
            failedAsset==="pump" ? "failed" : ""
          } ${
            selectedAsset === "pump" ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAsset("pump");
            toggleFailureAsset("pump");
          }}
        >
          <strong>Pumping Station</strong>
          <span>Water</span>
        </button>

        <div className="arrow">→</div>
      </div>

      <div className="node-wrapper">
        <button
          className={`node ${
            affectedAssets.includes("hospital") ? "affected" : ""
          } ${
            failedAsset==="hospital" ? "failed" : ""
          } ${
            selectedAsset === "hospital" ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAsset("hospital");
            toggleFailureAsset("hospital");
          }}
        >
          <strong>Hospital</strong>
          <span>Healthcare</span>
        </button>

        <div className="arrow">→</div>
      </div>

      <div className="node-wrapper">
        <button
          className={`node ${
            affectedAssets.includes("residential") ? "affected" : ""
          } ${
            failedAsset==="residential" ? "failed" : ""
          } ${  
            selectedAsset === "residential" ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedAsset("residential");
            toggleFailureAsset("residential");
          }}
        >
          <strong>Residential Zone</strong>
          <span>Community</span>
        </button>
      </div>
    </div>

    <div className="branch-arrow">
      Power → Hospital
    </div>
  </div>
</div>
<div className ="legend">
  <div >
    <span className="legend-box"></span>
    failed Asset
  </div>

  <div>
    <span className="legend-box affected-box"></span>
    Cascade Affected
  </div>

  <div>
    <span className="legend-box selected-box"></span>
    Selected Asset
  </div>
</div>

            <div className="controls">

              <button
                className="fail-button"
                onClick={simulateFailure}
              >
                Fail Selected Asset
              </button>

              <button
                className="reset-button"
                onClick={resetSimulation}
              >
                Reset
              </button>

              <button
                className="scenario-button"
                onClick={saveScenario}
              >
                Save Scenario
              </button>

            </div>

          </div>

          <div className="side-panel">

            <div className="metric">
              <span>Affected Assets</span>
              <strong>{affectedAssets.length}</strong>
            </div>

            <div className="metric">
              <span>Affected Population</span>

              <strong>
                {affectedPopulation.toLocaleString()}
              </strong>
            </div>

            <div className="metric">
              <span>Cascade Depth</span>
              <strong>{cascadeDepth}</strong>
            </div>

            <div className="metric">
              <span>Criticality Score</span>
              <strong>{criticalityScore}/100</strong>
            </div>

          </div>

        </section>

        <section className="details">

          <div className="details-card">

            <h3>Selected Asset</h3>

            <p>
              <strong>
                {
                  infrastructure.find(
                    (asset) =>
                      asset.id === selectedAsset
                  )?.name
                }
              </strong>
            </p>

            <p>
              Status:{" "}

              {failedAsset === selectedAsset
                ? "Failed"
                : "Operational"}
            </p>

          </div>

          <div className="details-card">

            <h3>Cascade Impact</h3>

            {affectedAssets.length === 0 ? (

              <p>
                No failure simulated yet. Select an
                infrastructure asset and trigger a failure.
              </p>

            ) : (

              <div className="impact-list">

                {affectedNodes.map((asset, index) => (

                  <div
                    key={asset.id}
                    className="impact-item"
                  >

                    <span>{index + 1}</span>

                    <div>

                      <strong>
                        {asset.name}
                      </strong>

                      <small>
                        {asset.service}
                      </small>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        <section className="critical-card">
  <h3>Critical Asset</h3>

  {criticalAsset ? (
    <>
      <strong>
        {
          infrastructure.find(
            (asset) => asset.id === criticalAsset
          )?.name
        }
      </strong>

      <p>
        Highest downstream impact in the current infrastructure
        network.
      </p>
    </>
  ) : (
    <p>Run a failure simulation to identify the critical asset.</p>
  )}
</section>

<section className="critical-card">
  <h3>How ResQgraph Works</h3>
  <p>
    Infrastructure assets are connected through dependency relationships.
    When a failure is injected,the simulator traces downstream dependencies to estimate cascading imapact,and criticalitity.
     
  </p>
</section>

        <section className="comparison">

          <div className="comparison-header">

            <h3>Scenario Comparison</h3>

            <p>
              Save two failure scenarios to compare
              their cascading impact.
            </p>

          </div>

          <div className="scenario-grid">

            <div className="scenario-card">

              <h4>Scenario A</h4>

              {scenarioA ? (

                <>
                  <p>
                    <strong>Failure:</strong>{" "}
                    {
                      infrastructure.find(
                        (a) => a.id === scenarioA.asset
                      )?.name
                    }
                  </p>

                  <p>
                    Affected Assets:{" "}
                    {scenarioA.affected.length}
                  </p>

                  <p>
                    Population:{" "}
                    {scenarioA.population.toLocaleString()}
                  </p>

                  <p>
                    Cascade Depth:{" "}
                    {scenarioA.depth}
                  </p>

                  <p>
                    Criticality:{" "}
                    {scenarioA.criticality}/100
                  </p>

                </>

              ) : (

                <p>No scenario saved yet.</p>

              )}

            </div>

            <div className="scenario-card">

              <h4>Scenario B</h4>

              {scenarioB ? (

                <>
                  <p>
                    <strong>Failure:</strong>{" "}
                    {
                      infrastructure.find(
                        (a) => a.id === scenarioB.asset
                      )?.name
                    }
                  </p>

                  <p>
                    Affected Assets:{" "}
                    {scenarioB.affected.length}
                  </p>

                  <p>
                    Population:{" "}
                    {scenarioB.population.toLocaleString()}
                  </p>

                  <p>
                    Cascade Depth:{" "}
                    {scenarioB.depth}
                  </p>

                  <p>
                    Criticality:{" "}
                    {scenarioB.criticality}/100
                  </p>

                </>

              ) : (

                <p>No scenario saved yet.</p>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
export default App; 