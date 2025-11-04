import React from "react";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default function EasyParent({ setCurrentPage }) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Easy Parent</h1>
              <p className="text-gray-600">Coming Soon...</p>
            </div>
          </div>

          <div className="text-center py-20 text-gray-500">
            <MessageSquare className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <p className="text-xl">Feature ini sedang dalam pengembangan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
