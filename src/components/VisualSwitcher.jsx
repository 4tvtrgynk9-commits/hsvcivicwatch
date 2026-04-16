import React from "react";
import TopVisual from "./TopVisual";

export default function VisualSwitcher({ visual, stats, rotationKey = 0 }) {
  return <TopVisual visual={visual} stats={stats} rotationKey={rotationKey} />;
}