import { Link } from "react-router";
import React from "react";

const AddButton: React.FC = () => {
  return (
    <div className="w-full flex justify-center mt-8">
      <Link
        to="/new"
        className="text-white font-bold py-2 px-4 rounded border border-white"
      >
        Dodaj nową książkę
      </Link>
    </div>
  );
};

export default AddButton;
