import { useEffect } from "react";

export function useCameraPanning({
  viewportRef,
  followCameraRef,
  cameraPosRef,
  cameraTargetRef,
  userPanningRef,
}) {
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = () => {
      followCameraRef.current = false;
      cameraPosRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
      cameraTargetRef.current = cameraPosRef.current;
    };

    const onPointerDown = () => {
      userPanningRef.current = true;
      followCameraRef.current = false;
      cameraPosRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
      cameraTargetRef.current = cameraPosRef.current;
    };

    const onPointerUp = () => {
      userPanningRef.current = false;
    };

    vp.addEventListener("wheel", onWheel, { passive: true });
    vp.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);
}