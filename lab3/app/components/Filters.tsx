import React from "react";

interface FiltersProps {
  isOpen: boolean;
}

export default function Filters({ isOpen }: FiltersProps) {
  return (
    <div
      className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen
          ? "max-h-96 border border-t-0 rounded-t-none"
          : "max-h-0 border-0"
      } bg-transparent shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[4.5px] rounded-b-[10px] border-white/18`}
    >
      <div className="pt-5 pb-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="mb-0">
            <label className="block text-sm font-medium text-white mb-1">
              Cena
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Od"
                className="w-full p-2 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-white/20 placeholder-gray-300 text-white"
                min="0"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                placeholder="Do"
                className="w-full p-2 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-white/20 placeholder-gray-300 text-white"
                min="0"
              />
            </div>
          </div>

          <div className="mb-0">
            <label className="block text-sm font-medium text-white mb-1">
              Ilość stron
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Od"
                className="w-full p-2 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-white/20 placeholder-gray-300 text-white"
                min="0"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                placeholder="Do"
                className="w-full p-2 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-white/20 placeholder-gray-300 text-white"
                min="0"
              />
            </div>
          </div>

          <div className="mb-0 md:col-span-2">
            <label className="block text-sm font-medium text-white mb-1">
              Rodzaj okładki
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center">
                <input
                  id="cover-hard"
                  name="cover-type"
                  type="radio"
                  value="hard"
                  className="h-4 w-4 text-gray-950 border-white/50 focus:ring-gray-950 bg-white/70"
                />
                <label
                  htmlFor="cover-hard"
                  className="ml-2 block text-sm text-white"
                >
                  Twarda
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="cover-soft"
                  name="cover-type"
                  type="radio"
                  value="soft"
                  className="h-4 w-4 text-gray-950 border-white/50 focus:ring-gray-950 bg-white/70"
                />
                <label
                  htmlFor="cover-soft"
                  className="ml-2 block text-sm text-white"
                >
                  Miękka
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="cover-any"
                  name="cover-type"
                  type="radio"
                  value=""
                  defaultChecked
                  className="h-4 w-4 text-gray-950 border-white/50 focus:ring-gray-950 bg-white/70"
                />
                <label
                  htmlFor="cover-any"
                  className="ml-2 block text-sm text-white"
                >
                  Wszystkie
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 bg-gray-950 text-white rounded-md hover:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-950">
            Zastosuj filtry
          </button>
        </div>
      </div>
    </div>
  );
}
