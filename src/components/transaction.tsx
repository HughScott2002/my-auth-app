// src/components/transaction.tsx

export default function Transactions() {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transactions Information</h2>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* <WalletSkeleton /> */}
      </div>
    </div>
  );
}
