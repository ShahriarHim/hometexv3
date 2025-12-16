import { Loader2 } from "lucide-react"; 

const LoadingSpinner = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-lg h-[500px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
