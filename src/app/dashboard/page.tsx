import { getMemories } from "@/lib/memories/get-memories";

import DashboardContent from "@/components/dashboard/dashboard-content";

import SaveForm from "./save-form";

export default async function DashboardPage() {
  const memories = await getMemories();

  return (
    <main className="p-10 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold">
        Stashly 🚀
      </h1>

      <p className="mt-3 text-zinc-500">
        Your AI memory system.
      </p>

      <div className="mt-8">
        <SaveForm />
      </div>

      <div className="mt-10">
        <DashboardContent
          initialMemories={memories}
        />
      </div>
    </main>
  );
}