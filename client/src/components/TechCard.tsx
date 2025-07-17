import { Handle, Position } from 'reactflow';

export default function TechNode({ data }: { data: { name: string; cost: string; icon: string; selected?: boolean; ranked?: number; target?: boolean } }) {
  return (
    <div className={`bg-background relative cursor-pointer text-white p-4 rounded-xl shadow-lg w-[190px] flex flex-col items-center 
        ${data.selected 
          ? 'border-4 border-[#5b9bd5]'
          : data.target
          ? 'border-4 border-[#58ca52]'
          : data.ranked !== -1
          ? 'border-4 border-[#cab852]'
          :''}`}>
      <Handle type="target" position={Position.Left} isConnectable={false} style={{ pointerEvents: 'none', opacity: 0 }}/>
      {
        data.ranked !== -1 ? <div className="absolute top-3 right-3 text-base">{data.ranked}</div> : null
      }
      { data.name === "Engineering" ?
        (<img src={"/icons/engineering.png"} alt=""  className="w-10 h-10 mb-1" />) :
        (<img src={data.icon} alt="" className="w-10 h-10 mb-1" />)
      }
      <div className="text-base font-bold text-center">{data.name}</div>
      <div className="text-sm text-gray-300">Cost: {data.cost}</div>
      <Handle type="source" position={Position.Right} isConnectable={false} style={{ pointerEvents: 'none', opacity: 0 }}/>
    </div>
  );
}