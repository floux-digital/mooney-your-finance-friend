import { Link } from "@tanstack/react-router";
import { Icon } from "./icons";

export function BottomNav({ active = "inicio" }: { active?: "inicio" | "assistente" }) {
  return (
    <nav className="flex items-center justify-center gap-2 px-5 pb-6 pt-2">
      {active === "inicio" ? (
        <span className="flex h-12 items-center gap-2 rounded-full bg-mooney-black pl-3 pr-4">
          <Icon name="inicio" size={24} invert />
          <span className="text-[10px] font-semibold text-mooney-white">Início</span>
        </span>
      ) : (
        <Link
          to="/"
          aria-label="Início"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
        >
          <Icon name="inicio" size={24} />
        </Link>
      )}

      <Link
        to="/assistente"
        aria-label="Assistente"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
      >
        <Icon name="assistente" size={24} />
      </Link>
      <button
        type="button"
        aria-label="Camadas"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
      >
        <Icon name="dash" size={24} />
      </button>
      <button
        type="button"
        aria-label="Mais"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
      >
        <Icon name="dots" size={24} />
      </button>
    </nav>
  );
}
