import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import CommandPalette from "./components/CommandPalette";
import ControlTower from "./screens/ControlTower";
import Firewall from "./screens/Firewall";
import RiskCenter from "./screens/RiskCenter";
import AIInvestigator from "./screens/AIInvestigator";
import TimeMachine from "./screens/TimeMachine";
import ControlGraph from "./screens/ControlGraph";
import AuditVault from "./screens/AuditVault";
import type { ScreenId } from "./lib/theme";

export default function App() {
  const [active, setActive] = useState<ScreenId>("control-tower");
  const [hovered, setHovered] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const screens: Record<ScreenId, React.ReactNode> = {
    "control-tower": <ControlTower onNavigate={setActive} />,
    firewall: <Firewall />,
    "risk-center": <RiskCenter />,
    "ai-investigator": <AIInvestigator />,
    "time-machine": <TimeMachine />,
    "control-graph": <ControlGraph />,
    "audit-vault": <AuditVault />,
  };

  return (
    <div
      className="grid h-full w-full text-[var(--text)] transition-[grid-template-columns] duration-200"
      style={{ gridTemplateColumns: hovered ? "220px 1fr" : "56px 1fr" }}
    >
      <Sidebar
        active={active}
        onNavigate={setActive}
        expanded={hovered}
        onHoverChange={setHovered}
      />
      <div className="flex min-w-0 flex-col">
        <TopBar active={active} onOpenCommand={() => setCommandOpen(true)} />
        <main
          key={active}
          className="fade-up scroll-thin min-h-0 flex-1 overflow-y-auto bg-[var(--bg)]"
        >
          {screens[active]}
        </main>
      </div>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={setActive}
      />
    </div>
  );
}
