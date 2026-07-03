export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-mist">Chargement du tableau de bord...</p>
      </div>
    </div>
  );
}
