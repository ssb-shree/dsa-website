import toast from "react-hot-toast";
const toasty = (message: string) => {
  return toast.custom((t) => (
    <div
      className={`
      rounded-xl
      bg-black/90
      backdrop-blur-md
      px-4 py-3
      text-white
      shadow-2xl shadow-black/40
      border border-white/10
      transition-all
      text-xs md:text-lg
      ${t.visible ? "animate-enter" : "animate-leave"}
    `}
    >
      {message}
    </div>
  ));
};

export { toasty };
