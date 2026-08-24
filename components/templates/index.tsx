import MinimalClean from "./minimal-clean";
import BoldDark from "./bold-dark";
import CorporatePro from "./corporate-pro";
import NeonStudio from "./neon-studio";
import SoftMinimal from "./soft-minimal";
import GridModern from "./grid-modern";
import EditorialSerif from "./editorial-serif";
import FrostGlass from "./frost-glass";
import RetroTerminal from "./retro-terminal";
import MagazineSpread from "./magazine-spread";
import ZenSpace from "./zen-space";
import Brutalist from "./brutalist";

export const TEMPLATES: Record<string, React.ComponentType<{ portfolio: any }>> = {
  "minimal-clean": MinimalClean,
  "bold-dark": BoldDark,
  "corporate-pro": CorporatePro,
  "neon-studio": NeonStudio,
  "soft-minimal": SoftMinimal,
  "grid-modern": GridModern,
  "editorial-serif": EditorialSerif,
  "frost-glass": FrostGlass,
  "retro-terminal": RetroTerminal,
  "magazine-spread": MagazineSpread,
  "zen-space": ZenSpace,
  "brutalist": Brutalist,
};
