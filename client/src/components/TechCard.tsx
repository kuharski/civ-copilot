import { Handle, Position } from 'reactflow';

export default function TechNode({ data }: { data: { name: string; cost: string; icon: string } }) {
  return (
    <div className="bg-[#1f2937] text-white p-2 rounded-xl shadow-lg w-[140px] flex flex-col items-center">
      <Handle type="target" position={Position.Left} isConnectable={false} style={{ pointerEvents: 'none' }}/>
      { data.name == "Engineering" ?
        (<img src={"/icons/engineering.png"} className="w-10 h-10 mb-1" />) :
        (<img src={data.icon} className="w-10 h-10 mb-1" />)
      }
      <div className="text-sm font-bold text-center">{data.name}</div>
      <div className="text-xs text-gray-300">Cost: {data.cost}</div>
      <Handle type="source" position={Position.Right} isConnectable={false} style={{ pointerEvents: 'none' }}/>
    </div>
  );
}