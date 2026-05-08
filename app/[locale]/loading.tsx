export default function LocaleLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#fbfaf7] text-neutral-950">
      <div className="text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-400">
          Richard Foto
        </p>
        <div className="mx-auto h-px w-28 overflow-hidden bg-neutral-200">
          <div className="h-full w-1/2 animate-[loading-line_1.35s_ease-in-out_infinite] bg-neutral-950" />
        </div>
      </div>
    </div>
  );
}
