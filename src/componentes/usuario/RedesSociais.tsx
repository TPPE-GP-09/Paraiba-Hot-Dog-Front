import iconeIfood from "../../imagens/social/ifood.svg";
import iconeInstagram from "../../imagens/social/instagram.svg";

type RedesSociaisProps = {
  className?: string;
  variant?: "plain" | "circulo" | "home";
};

export default function RedesSociais({
  className = "",
  variant = "plain",
}: RedesSociaisProps) {
  const isPlain = variant === "plain";
  const isHome = variant === "home";
  const homeButtonClass =
    "flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f3] shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_8px_18px_rgba(255,255,255,0.28),0_14px_30px_rgba(0,0,0,0.36)] transition-all hover:scale-105 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.7),0_10px_22px_rgba(255,255,255,0.34),0_18px_36px_rgba(0,0,0,0.42)]";
  const homeIconClass = "h-8 w-8";

  return (
    <div
      className={`flex shrink-0 items-center ${isPlain ? "gap-1" : "gap-2"} ${className}`}
    >
      <a
        href="https://www.ifood.com.br/delivery/brasilia-df/paraiba-hot-dog-sul-aguas-claras/6b414c09-98ff-427f-9c06-1b00ad1438fe"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir pelo iFood"
        className={
          isPlain
            ? "transition-opacity hover:opacity-70"
            : isHome
              ? homeButtonClass
              : "flex h-14 w-14 items-center justify-center rounded-full bg-preto-v1 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-all hover:opacity-80 hover:shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
        }
      >
        <img
          src={iconeIfood}
          alt=""
          aria-hidden
          className={
            isPlain
              ? "h-6 w-auto"
              : isHome
                ? "h-8 w-auto"
                : "h-7 w-auto brightness-0 invert"
          }
        />
      </a>
      <a
        href="https://www.instagram.com/paraibahotdog/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram da Paraíba Hot Dog"
        className={
          isPlain
            ? "transition-opacity hover:opacity-70"
            : isHome
              ? homeButtonClass
              : "flex h-14 w-14 items-center justify-center rounded-full bg-preto-v1 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-all hover:opacity-80 hover:shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
        }
      >
        <img
          src={iconeInstagram}
          alt=""
          aria-hidden
          className={
            isPlain
              ? "h-5 w-5"
              : isHome
                ? homeIconClass
                : "h-7 w-7 brightness-0 invert"
          }
        />
      </a>
    </div>
  );
}
