// MapObjects.jsx
import CabinStructure from "../map-objects/cabinStructure";
import WelcomeZone from "../map-objects/WelcomeZone";
import TeleportButton from "../map-objects/Teleport";
import Gaming from "../map-objects/gaming";
import PrivateRoom from "../map-objects/PrivetRoom";
import ManagerCabin from "../map-objects/Manager";
import SupervisorCabin from "../map-objects/Supervisor";
import BigTableStructure  from "../map-objects/bigtablestructure";
import TableStructure from "../map-objects/TableStructure";

// Each object now has a stable roomId (UUID-like placeholders) used for layout API.
// Teleport buttons intentionally excluded from room list collection.
const MapObjects = ({ containerRef, handleObstaclesFromChild }) => (
  <>
    <TableStructure roomId="room-tableA" id="tableA" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 12.5, y: 21.5 }} imageSize={450} />
    <BigTableStructure roomId="room-bigtable" id="bigtable" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 10.5, y: 76 }} imageSize={550} collisionWidthPx={160} collisionHeightPx={430} />
    <CabinStructure roomId="room-cabin" id="cabin" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 48.2, y: 33 }} />
    <ManagerCabin roomId="room-manager" id="manager" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={2620} y={212} width={323} height={240} />
    <TableStructure roomId="room-tableB" id="tableB" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} position={{ x: 85, y: 50 }} imageSize={450} />
    <SupervisorCabin roomId="room-supervisor" id="supervisor" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={2639} y={1620} width={323} height={240} />
    <Gaming roomId="room-gaming" id="gaming" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={2639} y={1890} width={323} height={240} />
    <PrivateRoom roomId="room-privateRoom" id="privateRoom" containerRef={containerRef} onObstaclesReady={handleObstaclesFromChild} x={920} y={1895} width={1040} height={240} />
    <WelcomeZone roomId="room-welcomeZone" x={920} y={1550} width={1040} height={240} />
    <TeleportButton x={2300} y={290} width={70} />
    <TeleportButton x={2100} y={1650} width={70} />
    <TeleportButton x={350} y={1090} width={70} />
  </>
);

export default MapObjects;