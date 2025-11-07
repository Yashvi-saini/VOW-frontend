// MapObjects.jsx
import CabinStructure from "../map/map objects/cabinStructure";
import WelcomeZone from "./map objects/WelcomeZone";
import TeleportButton from "./map objects/Teleport";
import Gaming from "./map objects/gaming";
import PrivateRoom from "./map objects/PrivetRoom";
import ManagerCabin from "./map objects/Manager";
import SupervisorCabin from "./map objects/Supervisor";
import BigTableStructure  from "./map objects/bigtablestructure";
import TableStructure from "../map/map objects/TableStructure";

const MapObjects = ({ containerRef, handleObstaclesFromChild }) => (
  <>
    <TableStructure id="tableA" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 12.5, y: 21.5 }} imageSize={450} />
    <BigTableStructure id="bigtable" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 10.5, y: 76 }} imageSize={550} />
    <CabinStructure id="cabin" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 48.2, y: 33 }} />
    <ManagerCabin id="manager" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={2620} y={212} width={323} height={240} />
    <TableStructure id="tableB" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 85, y: 50 }} imageSize={450} />
    <SupervisorCabin id="supervisor" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={2639} y={1620} width={323} height={240} />
    <Gaming id="gaming" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={2639} y={1890} width={323} height={240} />
    <PrivateRoom id="privateRoom" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={920} y={1895} width={1040} height={240} />
    <WelcomeZone x={920} y={1550} width={1040} height={240} />
    <TeleportButton x={2300} y={290} width={70} />
    <TeleportButton x={2100} y={1650} width={70} />
    <TeleportButton x={350} y={1090} width={70} />
  </>
);

export default MapObjects;