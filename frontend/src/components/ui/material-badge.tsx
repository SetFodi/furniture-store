// src/components/ui/material-badge.tsx
// A badge to show furniture materials

interface MaterialBadgeProps {
    material: string;
    className?: string;
  }
  
  export const MaterialBadge: React.FC<MaterialBadgeProps> = ({
    material,
    className = "",
  }) => {
    // Map materials to color schemes
    const materialColors: Record<string, string> = {
      Wood: "bg-amber-50 text-amber-900 border-amber-200",
      Oak: "bg-amber-50 text-amber-900 border-amber-200",
      Walnut: "bg-amber-50 text-amber-900 border-amber-200",
      Pine: "bg-amber-50 text-amber-900 border-amber-200",
      Mahogany: "bg-amber-50 text-amber-900 border-amber-200",
      Metal: "bg-slate-50 text-slate-900 border-slate-200",
      Steel: "bg-slate-50 text-slate-900 border-slate-200",
      Iron: "bg-slate-50 text-slate-900 border-slate-200",
      Aluminum: "bg-slate-50 text-slate-900 border-slate-200",
      Brass: "bg-yellow-50 text-yellow-900 border-yellow-200",
      Gold: "bg-yellow-50 text-yellow-900 border-yellow-200",
      Fabric: "bg-blue-50 text-blue-900 border-blue-200",
      Linen: "bg-blue-50 text-blue-900 border-blue-200",
      Cotton: "bg-blue-50 text-blue-900 border-blue-200",
      Velvet: "bg-purple-50 text-purple-900 border-purple-200",
      Leather: "bg-orange-50 text-orange-900 border-orange-200",
      Marble: "bg-gray-50 text-gray-900 border-gray-200",
      Glass: "bg-sky-50 text-sky-900 border-sky-200",
      Rattan: "bg-amber-50 text-amber-900 border-amber-200",
      Plastic: "bg-gray-50 text-gray-900 border-gray-200",
    };
  
    // Find the base material (e.g., "Oak Wood" -> "Wood")
    const baseMaterial = Object.keys(materialColors).find(base => 
      material.toLowerCase().includes(base.toLowerCase())
    ) || "Wood";
    
    const colorClasses = materialColors[baseMaterial] || "bg-gray-100 text-gray-800 border-gray-200";
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}>
        {material}
      </span>
    );
  };