const CAPABILITIES = [
  "Remembers what user said earlier in the conversation",
  "Allows user to provide follow-up corrections With Ai",
  "Limited knowledge of world and events after 2021",
  "May occasionally generate incorrect information",
  "May occasionally produce harmful instructions or biased content",
];

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center px-7 pt-4 pb-4">
      <h2 className="text-[#333] text-[40px] mb-8 select-none">BrainBox</h2>

      <div className="w-full space-y-3 mb-6">
        {CAPABILITIES.map((cap, i) => (
          <div
            key={i}
            className="bg-[#232627] flex justify-center rounded-2xl px-5 py-6"
          >
            <p className="text-[#999] text-sm text-center">{cap}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
